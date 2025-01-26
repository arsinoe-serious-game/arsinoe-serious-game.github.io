import json
import debug

with open('torbay_census.geojson', 'r') as f:
    data = json.load(f)

    with open('../assets/js/js/torbay_census_static.js', 'w') as fp:
        fp.write('let torbay_census_static = ')
        fp.write('\n')
        json.dump(data, fp)
        fp.write('\n')
        fp.write(';\n')

    with open('../assets/js/js/torbay_census_dyanmic.js', 'w') as fp:
        fp.write('let torbay_census_dynamic = {};')
        fp.write('\n')

        for feature in data['features']:
            fp.write("torbay_census_dynamic['" + feature['properties']['geo_code'] + "'] = '" + debug.createRandomColour() +"';\n")

        fp.write('\n')