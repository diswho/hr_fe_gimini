import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, Box, Tabs, Tab, Tooltip, IconButton
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab'; // Using lab for TreeView
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DepartmentsService, Department, DepartmentTreeNode as ApiDepartmentTreeNode } from '../../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`department-tabpanel-${index}`}
      aria-labelledby={`department-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Recursive component to render tree items
const RenderTree = (node: ApiDepartmentTreeNode) => (
  <TreeItem key={node.id} nodeId={String(node.id)} label={`${node.dept_name} (Code: ${node.dept_code})`}>
    {Array.isArray(node.children) ? node.children.map((childNode) => RenderTree(childNode)) : null}
  </TreeItem>
);

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentTree, setDepartmentTree] = useState<ApiDepartmentTreeNode[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingTree, setLoadingTree] = useState<boolean>(true);
  const [errorList, setErrorList] = useState<string | null>(null);
  const [errorTree, setErrorTree] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchDepartmentsList = useCallback(async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const response = await DepartmentsService.listDepartmentsApiV1DepartmentsGet(0, 200); // Increased limit
      setDepartments(response);
    } catch (err: any) {
      setErrorList(err.message || 'Failed to fetch departments list');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchDepartmentTree = useCallback(async () => {
    setLoadingTree(true);
    setErrorTree(null);
    try {
      const response = await DepartmentsService.getDepartmentTreeApiV1DepartmentsTreeGet();
      setDepartmentTree(response);
    } catch (err: any) {
      setErrorTree(err.message || 'Failed to fetch department tree');
    } finally {
      setLoadingTree(false);
    }
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      fetchDepartmentsList();
    } else if (tabValue === 1) {
      fetchDepartmentTree();
    }
  }, [tabValue, fetchDepartmentsList, fetchDepartmentTree]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Departments Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="department views">
          <Tab label="List View" id="department-tab-0" aria-controls="department-tabpanel-0" />
          <Tab label="Tree View" id="department-tab-1" aria-controls="department-tabpanel-1" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {loadingList && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2 }} />}
        {errorList && <Alert severity="error" sx={{ mt: 2 }}>{errorList}</Alert>}
        {!loadingList && !errorList && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="departments table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Parent Code</TableCell>
                  <TableCell>Company ID</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.length === 0 && !loadingList && (
                    <TableRow><TableCell colSpan={6} align="center">No departments found.</TableCell></TableRow>
                )}
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.id}</TableCell>
                    <TableCell>{dept.dept_name}</TableCell>
                    <TableCell>{dept.dept_code}</TableCell>
                    <TableCell>{dept.dept_parentcode ?? 'N/A'}</TableCell>
                    <TableCell>{dept.company_id}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton component={RouterLink} to={`/departments/${dept.id}`} aria-label="view department details">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {loadingTree && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2 }} />}
        {errorTree && <Alert severity="error" sx={{ mt: 2 }}>{errorTree}</Alert>}
        {!loadingTree && !errorTree && (
          departmentTree.length > 0 ? (
            <Paper sx={{p:2, mt: 2}}>
            <TreeView
              aria-label="department tree"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ flexGrow: 1, overflowY: 'auto' }}
            >
              {departmentTree.map((node) => RenderTree(node))}
            </TreeView>
            </Paper>
          ) : (
            <Typography sx={{mt:2}}>No department tree data available or tree is empty.</Typography>
          )
        )}
      </TabPanel>
    </Container>
  );
};

export default DepartmentsPage;
