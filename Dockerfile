FROM node:14

WORKDIR /opt/admin-tree-gifting

RUN apt-get update && apt-get -y install vim nginx

RUN npm link @angular/cli@11.0.7

ADD  . .

RUN npm install

RUN ng build --prod

ADD nginx/conf /etc/nginx/sites-available/admin_tree_gifting_conf

RUN ln -s -f /etc/nginx/sites-available/admin_tree_gifting_conf /etc/nginx/sites-enabled/default

EXPOSE 80

CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]