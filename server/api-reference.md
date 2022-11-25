# Common

`get` **/api/users/:userId/initialize/:dateString**

*if no occurrences exist for today (first time logging in today) not-completed occurrences are added for all habits that were selected the last time the user logged on*

*then returns user's habits, occurrences grouped by date, occurrence streaks, and oldest completed occurrence dates*

**!!!!** if this is the first time logging on / no previous occurrences exist, the occurrences property will still contain a key with the current date, containing no habit ids

**!!!!** oldest occurrence is null if no completed occurrences exist for the given habit

**Returns:**
```
{
  "habits": [
    {
      "id": 5,
      "name": "exercise",
      "order": 2
    },
    ...
  ],
  "occurrences": {
    "2022-11-22": {
      "5": true,
      ...
    },
    ...
  },
  "streaks": {
    "5": {
      "current": 0,
      "maximum": 1
    },
    ...
  },
  "oldestOccurrences": {
    "5": "2021-04-10",
    ...
  }
}
```

# Habits

`get` **/api/habits/users/:userId**

*returns array of user's habits sorted by id*

**Query Parameters:**
- userId: number

**Returns:**
```
[
    {
        "id": 5,
        "name": "exercise",
        "order": 2
    },
    ...
]
```

---

`post` **/api/habits**

*creates and returns created habit & creates a not-completed occurrence at the dateString*

**Body Properties:**
- userId: number `required`
- name: string `required`
- dateString: YYYY-MM-DD string `required`

**Returns:**
```
{
    "id": 5,
    "name": "exercise",
    "order": 2
}
```

---

`patch` **/api/habits/:habitId**

*updates and returns updated habit*

**Query Parameters:**
- userId: number

**Body Properties:**
- name: string `optional`
- order: number `optional`

**Returns:**
```
{
    "id": 5,
    "name": "exercise",
    "order": 2
}
```

---

`delete` **/api/habits/:habitId**

*deletes habit*

**Query Parameters:**
- userId: number

# Occurrences

`get` **/api/occurrences/users/:userId**

*returns object of user's occurrences grouped by date*
*occurrences returned as `{habit id: completed}`*

**Query Parameters:**
- userId: number

**Returns:**
```
{
  "2022-11-22": {
    "5": true
  },
  "2022-11-23": {
    "5": false
  },
  ...
}
```

---

`get` **/api/occurrences/streaks/:dateString/users/:userId**

*returns object of user's occurrence streaks grouped by habit id*

**Query Parameters:**
- dateString: YYYY-MM-DD string
- userId: number

**Returns:**
```
{
  "5": {
    "current": 0,
    "maximum": 6
  },
  ...
}
```

---

`get` **/api/occurrences/oldest/users/:userId**

*returns object of user's oldest completed occurrences grouped by habit id*

**!!!!** oldest occurrence is null if no completed occurrences exist for the given habit

**Query Parameters:**
- userId: number

**Returns:**
```
{
  "4": null,
  "5": "2022-11-22",
}
```

---

`post` **/api/occurrences**

*creates one or multiple occurrences*

**Body Properties:**
- occurrences: array of occurrence objects `required`

Occurrence Object:
```
  {
    habitId: number -- required
    completed: boolean -- required
    dateString: YYYY-MM-DD string -- required
  }
```

---

`patch` **/api/occurrences/:habitId/:dateString**

*updates occurrence*

**Query Parameters:**
- habitId: number
- dateString: YYYY-MM-DD string

**Body Properties:**
- completed: boolean `required`

---

`delete` **/api/occurrences/:habitId/:dateString**

*deletes occurrence*

**Query Parameters:**
- habitId: number
- dateString: YYYY-MM-DD string
