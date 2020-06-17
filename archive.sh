#!/bin/bash
./clean.sh

date +'FORMAT'
 
### mm/dd/yyyy ###
date +'%m/%d/%Y'
 
## Time in 12 hr format ###
date +'%r'
 
## backup dir format ##
backup_dir=$(date +'_%y_%m_%d_%H_%M_%S')

tar -czvf "../UiDev${backup_dir}.tar.gz" ./