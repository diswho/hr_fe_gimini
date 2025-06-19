# hr_fe_gimini
HR Frontend System, use gimini to vibe code

    npm install --legacy-peer-deps

## pass Setup:
    gpg --generate-key

result

    pub   ed25519 2025-06-18 [SC] [expires: 2028-06-17]
        F1B14DDF77633061832B47B2FE2B722E3658247E
    uid                      
    sub   cv25519 2025-06-18 [E] [expires: 2028-06-17]

    pass init F1B14DDF77633061832B47B2FE2B722E3658247E

## Install 

    curl -s https://download.opensuse.org/repositories/isv:/Rancher:/stable/deb/Release.key | gpg --dearmor | sudo dd status=none of=/usr/share/keyrings/isv-rancher-stable-archive-keyring.gpg
    echo 'deb [signed-by=/usr/share/keyrings/isv-rancher-stable-archive-keyring.gpg] https://download.opensuse.org/repositories/isv:/Rancher:/stable/deb/ ./' | sudo dd status=none of=/etc/apt/sources.list.d/isv-rancher-stable.list
    sudo apt update
    sudo apt install rancher-desktop