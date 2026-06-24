# API Test Scenarios - Reqres.in

| Scenario ID | Endpoint | Method | Type | Description | Expected Result |
|---|---|---|---|---|---|
| TC-01 | `/api/users` | POST | Positive | Create a new user with valid `name` and `job` | HTTP 201 Created. Response contains `name`, `job`, `id`, and `createdAt` |
| TC-02 | `/api/users` | POST | Negative | Create a user with missing body fields (empty payload) | HTTP 201 Created. Response contains only `id` and `createdAt` |
| TC-03 | `/api/users` | POST | Edge | Create user with XSS payload in `name` (`<script>alert('XSS')</script>`) | HTTP 201 Created. Payload accepted without sanitization (mock behavior) |
| TC-04 | `/api/users` | POST | Edge | Create user with incorrect data types (`name` as int, `job` as bool) | HTTP 201 Created. Types accepted without validation error |
| TC-05 | `/api/users` | GET | Positive | Retrieve users for valid page (`?page=2`) | HTTP 200 OK. Contains pagination metadata and `data` array |
| TC-06 | `/api/users` | GET | Negative | Retrieve users for an out-of-bounds page (`?page=1000`) | HTTP 200 OK. `page` is 1000, but `data` array is empty |
| TC-07 | `/api/users` | GET | Edge | Pass string as page query parameter (`?page=dua`) | HTTP 200 OK. Graceful fallback (e.g., returns page 1 or empty data) |
| TC-08 | `/api/users/2` | PUT | Positive | Update user with valid `name` and `job` | HTTP 200 OK. Response contains updated `name`, `job`, and `updatedAt` |
| TC-09 | `/api/users/2` | PUT | Negative | Update user with empty payload | HTTP 200 OK. Response falls back to returning only `updatedAt` |
| TC-10 | `/api/users/2` | PUT | Edge | Update user with excessively long string (5000 chars) for `name` | HTTP 200 OK. Mock accepts large payloads |
| TC-11 | `/api/users/2` | GET | Positive | Retrieve details of an existing user (`id=2`) | HTTP 200 OK. Response contains user object |
| TC-12 | `/api/users/23` | GET | Negative | Attempt to retrieve a non-existent user (`id=23`) | HTTP 404 Not Found. Response body is empty |
| TC-13 | `/api/users/2` | DELETE | Positive | Delete an existing user (`id=2`) | HTTP 204 No Content. Response body is empty |
| TC-14 | `/api/users/invalid_id` | DELETE | Negative | Attempt to delete user using invalid ID format (`id=string`) | HTTP 204 No Content. Mock API accepts any format |
