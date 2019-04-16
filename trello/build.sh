#!/bin/bash
minifiedjs=`cat ./trello/bundle.js`
output="javascript:{${minifiedjs}};void(0);"
echo $output
