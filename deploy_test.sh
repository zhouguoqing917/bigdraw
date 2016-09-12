#!/bin/sh
YDAY=`date +%Y%m%d%H%M%S`
dt=`date +%Y%m%d`
. /etc/profile
echo $YDAY
src=./dist
tag=/opt/www/pages/upload/bigdraw
cd $src/* && cp -r * $tag/


