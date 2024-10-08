# CMPT370_Team30

# Steps to run this properly:
There is a dockerfile and docker-compose included with this project, so you must use docker along-side a terminal to run the website. The only main step is getting that container to run and ensuring that the server is running inside it. The database is remote, so there should be no worries about setting up the database. 

## Docker
Ensure you have the dockerfile and the docker-compose in the project. Open a terminal and change directories to wherever the project was downloaded. Ex:

```
cd /path/to/project
```

Next you can list files with `ls` to guarantee you are in the right directory containing the docker files. Next run the following:

```
docker-compose up -d
```

This command will run the docker-compose file and create a container in which the NodeJS server will run. You can double check that it is running by opening the container and checking the logs. If you do not have a visual gui to do this it's ok, you can simply try accessing the website at `http://localhost:8080/`.

# How to use the site
Once you are on the site, make an account. Once that is done you may sign in! You can start by exploring the different features. It is recommended to make a dashboard item. These are used to tag other items so that they appear when you click the dashboard item button. Everything tagged with the dashboard item will show up in the item.

You may also like the maps feature, that not only has Google maps embedded, but also a list of floorplans of the main campus buildings!

You can add a grade object that allows you to add a grade scheme that you can find in your classes syllabus. You add them in manually, and then you can add graded items such as assignments or midterms, assign them a grade and to which category from the syllabus they belong. You will get a average from the grades you have included so far.

You can add Todo list items! You can also check out the callendar feature and add events!
