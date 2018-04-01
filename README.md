# snapAll :computer::computer::computer:

### About Project
This project is a software that tracks the activities of employees of an organization. It allows Admin to take the snapshots of his/her employees' screens at a single click and can see the screenshots on his/her screen.

# Deploy Instructions

Following are the steps to be followed to deploy the web-app (adapt according to your OS):

**On Server**
  * Install NodeJS.
  * Place *SnapAll* web-app folder somewhere on the server.
  * Go to the *SnapAll* directory and open the terminal.
  * Type *npm install* on the terminal and hit Enter.
  * Open *config.js* file inside *SnapAll* directory. Add *username* and *password* according to your requirements. Specify *ServerPort* and *ClientPort*.
  * Run the command *node server.js*.

**On Client side**
  * Place the *client.js* script in the system.
  * Configure it to run on the system startup.
  * Make sure that port number specified in *config.js* file placed on server is available, otherwise, edit port number in *config.js* file on server.
