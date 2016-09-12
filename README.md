cd bigdraw
#star test
supervisor ./bin/www

#prod
pm2 start ./bin/www

#min js/css
gulp
