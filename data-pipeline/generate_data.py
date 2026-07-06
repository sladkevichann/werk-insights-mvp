from faker import Faker # library faker
import json
import random

fake = Faker()

STUDIOS = ["Run the Flex", "Studio North", "Playground London", "Milenium Dance Complex", "The Underground Dance Centre"]
INSTRUCTORS = ["Saskia Raparanta", "Alessia Gerasolo", "Paul Mula", "Carl Mandac", "Shane Tubog", "Marianne Kanaan"]
STYLES = ["Hip-Hop", "Heels", "Jazz Funk", "Popping"]
LEVELS = ["Beg", "Int/Adv", "All Levels"]
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
TIMES = ["10:00", "14:00", "17:00", "19:00", "20:30"]

students = []

for i in range(150):
    students.append({
        "id": f"stu_{i}", # pasting numbers 0-149
        "name": fake.name(),
        "email": fake.unique.email(),
    })

with open("students.json", "w") as f:
    json.dump(students, f, indent=2)

print(f"Students generated: {len(students)}")

events = []
for i in range(300):
    # making Friday and Hip-Hop more popular
    day = random.choices(DAYS, weights=[10, 10, 10, 12, 25, 20, 13])[0] # [0] takes el of a list
    style = random.choices(STYLES, weights=[34, 26, 18, 13])[0]

    capacity = random.choice([10, 15, 20, 30])
    booked = int(capacity * random.uniform(0.3, 1.0))
    
    # dict
    events.append({
        "id": f"evt_{i}",
        "title": f"{style} Class",
        "style": style,
        "level": random.choice(LEVELS),
        "day_of_week": day,
        "start_time": random.choice(TIMES),
        "date": fake.date_between(start_date="-90d", end_date="today").isoformat(),
        "price": random.choice([15, 18, 20, 25]),
        "capacity": capacity,
        "booked": booked,
        "studio": random.choice(STUDIOS),
        "instructor": random.choice(INSTRUCTORS),
    })

with open("events.json", "w") as f:
    json.dump(events, f, indent=2)

print(f"Events generated: {len(events)}")

bookings = []
for i in range(800):
    event = random.choice(events)
    student = random.choice(students)

    bookings.append({
        "id": f"bkg_{i}",
        "event_id": event["id"],
        "student_id": student["id"],
        "status": random.choices(["Paid", "Refunded", "Failed"], weights=[85, 10, 5])[0],
        "amount": event["price"],
        "booked_at": event["date"],
    })

with open("bookings.json", "w") as f:
    json.dump(bookings, f, indent=2)

print(f"Bookings generated: {len(bookings)}")