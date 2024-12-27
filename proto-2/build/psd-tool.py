from psd_tools import PSDImage
import json

psd = PSDImage.open('/Users/gareth/Documents/dev/arsinoe/arsinoe-serious-game.github.io/proto-2/build/arsinoe-serious-layout.psd')
#psd.composite().save('example.png')

def do_layer(layer, indent, data):

    text = ''
    for i in range(0,indent):
        text += '\t'

    if layer.kind == 'pixel':
        data[layer.name] = {'offset': layer.offset, 'size': layer.size}
        print(text + layer.name +' pixel map' + str(layer.offset) +' ' + str(layer.size))
    else:
        print(text + layer.name + ' group' + str(layer.offset) +' ' + str(layer.size))
        data[layer.name] = {'offset': layer.offset, 'size': layer.size, 'children': {}}
        for l in layer:
            do_layer(l, indent + 1,  data[layer.name]['children'])


for layer in psd:
    data = {}
    do_layer(layer, 0, data)

    print(data)

    with open('../game/layout.js', 'w') as fp:
        fp.write('let layout = ')
        fp.write('\n')
        json.dump(data, fp, indent=4)
        fp.write(';\n')
        fp.write('\n')
        fp.close()

