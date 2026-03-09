from fastapi import APIRouter

router = APIRouter()

# Coordinates along the road
route = [
    (28.6139, 77.2090),
    (28.6141, 77.2093),
    (28.6145, 77.2098),
    (28.6150, 77.2104),
    (28.6155, 77.2112),
    (28.6160, 77.2120),
    (28.6165, 77.2130),
    (28.6170, 77.2140),
    (28.6175, 77.2150)
]

index = 0

@router.get("/bus/{bus_id}")
def get_bus_location(bus_id: int):
    global index

    lat, lng = route[index]

    index = (index + 1) % len(route)

    return {
        "bus_id": bus_id,
        "lat": lat,
        "lng": lng
    }