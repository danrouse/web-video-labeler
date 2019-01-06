#!/bin/python
import os
import path
import re
import math
import argparse
try:
	from urllib.request import urlopen
except ImportError:
	from urllib2 import urlopen

parser = argparse.ArgumentParser(description='Prepare Darknet data')
parser.add_argument('data_dir', default='data')
parser.add_argument('--train_test_ratio', type=float, default=0.8)
parser.add_argument(
    '--base_cfg',
    type=str,
    default='https://raw.githubusercontent.com/AlexeyAB/darknet/master/cfg/yolov3-tiny_obj.cfg'
)
args = parser.parse_args()

data_dir = args.data_dir

data_files = [f for f in os.listdir(data_dir) if f.endswith('.darknet-unprepared.txt')]
classes = set()
for f in data_files:
    with open(os.path.join(f), 'r') as df:
        for line in df.read().splitlines():
            classes.add(line.split(' ')[0])

for f in data_files:
    with open(os.path.join(f), 'r') as df:
        contents = df.read()
        for i, c in enumerate(classes):
            contents = re.sub('^' + c + ' ', str(i) + ' ', contents, flags=re.MULTILINE)
        with open(os.path.join(f.replace('.darknet-unprepared.txt', '.txt')), 'w') as wf:
            wf.write(contents)

with open('names.list', 'w') as f:
    f.write('\n'.join(classes))

split_index = math.ceil(len(data_files) * args.train_test_ratio)
prepared_paths = [os.path.join(f.replace('.darknet-unprepared.txt', '.jpg')) for f in data_files]
with open('train.list', 'w') as f:
    f.write('\n'.join(prepared_paths[:split_index]))
with open('test.list', 'w') as f:
    f.write('\n'.join(prepared_paths[split_index:]))

with open('data.cfg', 'w') as f:
    f.write('\n'.join([
        'classes = ' + str(len(classes)),
        'train = train.list',
        'valid = test.list',
        'names = names.list',
        'backup = backup'
    ]))

config = urlopen(args.base_cfg).read().decode('utf-8')
config = re.sub('^batch=\d+$', 'batch=64', config, flags=re.MULTILINE)
config = re.sub('^subdivisions=\d+$', 'subdivisions=8', config, flags=re.MULTILINE)
config = re.sub('^classes=\d+$', 'classes=' + str(len(classes)), config, flags=re.MULTILINE)
config = re.sub('^filters=255$', 'filters=' + str((len(classes) + 5) * 3), config, flags=re.MULTILINE)
with open('network.cfg', 'w') as f:
    f.write(config)
