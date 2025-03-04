### This application has been made as a finel project for University of Helsinki Full stack development couse

### [Live version](https://enroll-app.onrender.com)

### Deployment:
   Hoisting: Render

#### <span style="color:red">&#9888;</span> Since the project is uploaded to a free version hosting it might take some time to load information, thus if you are logged in you may not have immediate access to some pages where user information is required

The application allows "masters" to list and delete procedures they can perform, set dates and time ranges for each procedure, set and change price
On the other hand, "users" can choose dates and time and book procedures, as well as cancel procedures
And "Admins" can ban and unban users and masters restricting them to create and enroll in procedures

All users are able to register manually or login by Google
They can change their data as well as update password
If a user doesn't remebmer their password they can ues the "forgot password" functionality to receive an email to reset a password


### Test users
#### User:
email: user@user.user
password: user12345

#### Master:
email: master@master.master
password: master12345

#### Admin:
email: admin@admin.admin
password: admin12345


In this application users are able to




Timeslots are created by masters and are being available times for procedures
Booking has userProcedureId, and booking had timeSlotId


Backend:
duration in addMasterProcedure specifies the time required to perform a specific procedure

slotDuration in createTimeSlots defines the length of each time slot the master's day is divided into
For example, a slotDuration of 60 minutes means the master's day is divided into 60-minute blocks

## Time Tracking

### Tasks Backend

| Task         | Time (hours) |
|-------------|-------------|
| tests       | 25          |
| booking     | 10          |
| procedure   | 8           |
| timeSlots   | 12          |
| cloudinary  | 2           |
| user        | 25          |
| middlewares | 15          |
| error api   | 2           |
| migrations  | 10          |
| utils       | 1           |

### Tasks Frontend

| Task          | Time (hours) |
|--------------|-------------|
| TS config    | 2           |
| Redux setup  | 2           |
| booking api  | 0.5         |
| procedure api| 0.5         |
| timeSlot api | 0.5         |
| user api     | 6           |
| components   | 3           |
| jwt decoder  | 1           |
| custom hook  | 1           |
| types        | 2           |
| pages        | 40          |
| style        | 10          |

### CI/CD

| Task | Time (hours) |
|------|-------------|
| CI/CD | 2         |

### monolith deploy and confuguring root package lson
| Task | Time (hours) |
|------|-------------|
| Deploy | 8         |