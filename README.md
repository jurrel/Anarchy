# Return to Anarchy!

Anarchy is a full stack web application clone of Discord, it allows users to create servers where they can have group chats with anyone else who belongs to the server. They can also add friends for direct messaging or a quick video chat! Visit the live site here: [ANARCHY](https://anarchy-app.herokuapp.com "Anarchy").

---

## Technology Used

| Front End|Back End|
|:---|---:|
| Javascript | Python |
| React | Flask |
| Redux | SQL Alchemy |
| Vanilla Css | PostgreSQL |
| Websockets | Flask-Login |
| WebRTC |  |
| AWS Image upload | |

---

## To Set Up Locally
- For full functionality you will need
   - .env file with: 
      - FLASK_APP=app
      - FLASK_ENV=development
      - SECRET_KEY= 'whatever you want'
      - DATABASE_URL= 'PostgreSQL database link' - "postgresql://USER:PASSWORD@localhost/DATABASE
      - S3_BUCKET_NAME= 'Bucket name'
      - S3_ACCESS_KEY= 'Access key'
      - S3_SECRET_ACCESS_KEy= 'Secret key'
- Download the zip file
- CD into app in a terminal shell
- Command - pipenv install
- Command - pipenv run flask run
- Second terminal!
- CD into react-app
- Command - npm install
- Command - npm start
   - Backend at port 5000, Front end at port 3000. ENJOY!

## Screenshots

---

### Database
![Database Image](/images/Database.png)

---
### In Action
![Action Image](/images/Screenshot.png)

---