# gps
gps_position = []

while True:
    lat_input = input("Enter latitude : or 'exit' to stop ")
    if lat_input.lower() =='exit':
        break
    lon_input = input("Enter Longitude : ")

    try:
        latitude = float(lat_input)
        longitude = float(lon_input)

    except ValueError:
        print("invalid Character ")
        continue
    gps_position.append((latitude,longitude))
    for i,(lat,lon) in enumerate(gps_position,1):
        print(f"{i:02d} ->  latitude :{lat :.4f}  longitude :{lon :.4f}")
        print("-"*50)



   
