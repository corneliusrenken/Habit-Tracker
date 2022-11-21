# Api Reference

## Habits

`get` **/api/habits/:userId**

*returns array of user's habits sorted by id*

```
[
    {
        "id": 1,
        "name": "go out with dogs",
        "order": 0,
        "selected": true
    },
    ...
]
```

## Occurrences

`get` **/api/occurrences/:userId**

*returns object containing user's occurrences and the oldest date with an occurrence*

***caution**: filtering the result with the from/until query parameters will also cause the oldest property to represent the oldest occurrence **within** that selection*

**Optional Query Parameters:**
- from: YYYY-MM-DD (inclusive boundary)
- until: YYYY-MM-DD (inclusive boundary)

```
{
    "occurrences": {
        "2022-06-01": [
            1,
            2,
            3,
            4
        ],
        "2022-06-02": [
            1,
            2,
            4
        ],
        ...
    },
    "oldest": "2022-06-01"
}
```

---

`post` **/api/occurrences**

*add an occurrence entry for a given date and habit id*

**Body Properties:**
- habitId: number (bound to user so don't need user id)
- date: YYYY-MM-DD

---

`delete` **/api/occurrences**

*delete an occurrence entry for a given date and habit id*

**Body Properties:**
- habitId: number (bound to user so don't need user id)
- date: YYYY-MM-DD

---

`get` **/api/occurrences/streaks/:userId**

*returns object containing current and maximum streak for user's habit ids*

**Query Parameters:**
- today: YYYY-MM-DD (to calculate current streak)

```
{
    "1": {
        "current": 0,
        "maximum": 102
    },
    ...
}
```

## Completed Days


`get` **/api/completed-days/:userId**

*returns object containing completed days and oldest completed day*

```
{
    "completed": {
        "2022-09-09": true,
        "2022-09-08": true,
        "2022-09-07": true,
        ...
    },
    "oldest": "2022-06-01"
}
```

---

`post` **/api/completed-days**

*add a completed day entry for a given date and user*

**Body Properties:**
- userId: number
- date: YYYY-MM-DD

---

`delete` **/api/completed-days**

*remove a completed day entry for a given date and user*

**Body Properties:**
- userId: number
- date: YYYY-MM-DD