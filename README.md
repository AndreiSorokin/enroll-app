### This application has been made as a finel project for University of Helsinki Full stack development couse

### TODO Link to an address, where the application is running

The application allows masters to list procedures they can perform, set dates and time ranges for each procedure
From the other hand, users can choose dates and time and book procedures

### TODO add test userss

### TODO Link to work hours listing


Timeslots are created by masters and are being available times for procedures
Booking has userProcedureId, and booking had timeSlotId


Backend:
duration in addMasterProcedure specifies the time required to perform a specific procedure

slotDuration in createTimeSlots defines the length of each time slot the master's day is divided into
For example, a slotDuration of 60 minutes means the master's day is divided into 60-minute blocks