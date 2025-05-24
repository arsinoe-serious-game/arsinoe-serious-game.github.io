import json
import debug

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

from itertools import count, takewhile
def frange(start, stop, step):
    return takewhile(lambda x: x< stop, count(start, step))



def build_torbay_census_data():
    with open('torbay_census.geojson', 'r') as f:
        data = json.load(f)

        with open('../assets/js/js/torbay_census_static.js', 'w') as fp:
            fp.write('let torbay_census_static = ')
            fp.write('\n')
            json.dump(data, fp)
            fp.write('\n')
            fp.write(';\n')

        with open('../assets/js/js/torbay_census_dynamic.js', 'w') as fp:
            fp.write('let torbay_census_dynamic = {};')
            fp.write('\n')

            for feature in data['features']:
                fp.write("torbay_census_dynamic['" + feature['properties']['geo_code'] + "'] = '" + debug.createRandomColour() +"';\n")

            fp.write('\n')


def build_torbay_weather_data():
    regions = {
        "Brixham": {
            "rect": [
                [
                    -3.566823,
                    50.412656
                ],
                [
                    -3.482775,
                    50.413758
                ],
                [
                    -3.481527,
                    50.373752
                ],
                [
                    -3.565504,
                    50.372651
                ]
            ],
            'col': '#ff0000',
        },
        "Paignton": {
            "rect": [
                [
                    -3.612472,
                    50.469556
                ],
                [
                    -3.551369,
                    50.470387
                ],
                [
                    -3.549365,
                    50.409041
                ],
                [
                    -3.610389,
                    50.408212
                ]
            ],
            'col': '#00ff00',
        },

        "Torquay": {
            "rect": [
                [
                    -3.582708,
                    50.509987
                ],
                [
                    -3.482585,
                    50.511305
                ],
                [
                    -3.480749,
                    50.452618
                ],
                [
                    -3.580749,
                    50.451303
                ]
            ],
            'col': '#0000ff',
        }
    }

    with open('../assets/js/js/torbay_weatherapi_static.js', 'w') as fp:
        fp.write('let torbay_weatherapi_static = ')
        fp.write('\n')
        json.dump(regions, fp, indent=4)
        fp.write('\n')
        fp.write(';\n')


    #work out bounding area of regions
    sx = 100
    fx = -100
    sy = 90
    fy = 0

    region_polys = []

    for region in regions:
        for pt in regions[region]['rect']:
            if sx > pt[0]:
                sx = pt[0]

            if fx < pt[0]:
                fx = pt[0]

            if pt[1] < sy:
                sy = pt[1]
            if pt[1] > fy:
                fy = pt[1]

        region_polys.append(Polygon(regions[region]['rect']))

    sx -= 0.01;
    sy -= 0.01;

    with open('../assets/js/js/torbay_weatherapi_dynamic.js', 'w') as fp:
        fp.write('let torbay_weatherapi_dynamic = [')
        fp.write('\n')


        for lat in frange(sx, fx+0.01, 0.01):
            for lng in frange(sy,fy+0.01, 0.01):

                point_in_polys = False

                for poly in region_polys:
                    if poly.contains(Point(round(lat,2),round(lng,2))):
                        point_in_polys = True

                #point_in_polys = True

                if point_in_polys:
                    fp.write("\t{'loc':[" + str(round(lat,2)) + "," + str(round(lng,2)) + "]},\n")

        fp.write('];\n')




if __name__ == '__main__':
    #build_torbay_census_data()
    build_torbay_weather_data()