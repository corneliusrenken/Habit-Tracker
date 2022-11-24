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
        "selected": true,
        "order": 2
    },
    ...
]
```

---

`post` **/api/habits**

*creates and returns created habit*

**Body Properties:**
- userId: number `required`
- name: string `required`
- dateString: YYYY-MM-DD string `required`

**Returns:**
```
{
    "id": 5,
    "name": "exercise",
    "selected": true,
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
- selected: boolean `optional`
- dateString: YYYY-MM-DD string `required only if updating selected property`

**Returns:**
```
{
    "id": 5,
    "name": "exercise",
    "selected": true,
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

*returns object of user's oldest **true** occurrences grouped by habit id*

**!!!!** oldest occurrence is null if no true occurrences exist for the given habit

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
