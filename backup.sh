#!/bin/bash

# Shell command to tar directory excluding certain files/folders
# https://stackoverflow.com/questions/984204/shell-command-to-tar-directory-excluding-certain-files-folders

if [ $1 ]; then 
	FILE=".bak/$1.tgz"
	tar -czvf $FILE \
	--exclude-tag-all=exclude.tag \
	.
else	
	echo "error! you must supply filename without extension ex: '$0 bak001'."
fi
