﻿# appointment_be
 
 ## Appointment Criteria & Assumptions
 * Book Appointment for Work days, Mon- Fri 9am - 6pm
 * Book 2 business days in advance & not more than 3 weeks in advance 
 * assume able to book earliest 2021-09-22 appointment on 2021-09-20
 * assume 3 weeks in advance includes weekends (21 days).

## Setup
* Clone [.env_sample](https://github.com/cra2yworks/appointment_be/blob/main/.env_sample) and rename to .env
* Setup/Start MongoDB & Update MONGODB_CONNECTION in .env
* Install dependencies
```
npm install
```

## Run App
```
npm run start
```

## API Test
* Refer to [request.rest](https://github.com/cra2yworks/appointment_be/blob/main/requests.rest)
* Install RestClient extension in VsCode to test with request.rest easily.
