Routific URL shortener

### POST `/api/v1.0/shorten`

Returns a short url given a long one. The input body should be:
```json
{
  "long_url": "https://app.routific.com/m/vehicle/5a733e96e3c8fa16e59b57a4/routes/5ac532a21c4dfa0aecb904b7"
}
```
The output format would be
```json
{
    "long_url": "https://app.routific.com/m/vehicle/5a733e96e3c8fa16e59b57a4/routes/5ac532a21c4dfa0aecb904b7",
    "short_id": "c_HJ-qoM2Goz",
    "short_url": "https://routi.fi/c_HJ-qoM2Goz"
}
```

### GET `/:short_id`

Redirects to the long url
