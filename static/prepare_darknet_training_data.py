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

parser = argparse.ArgumentParser(
    description='Generate files needed to train a darknet detector from web-video-labeler data')
parser.add_argument('data_dir', default='data',
    help='directory containing unprepared darknet label data')
parser.add_argument('--train_test_ratio', type=float, default=0.8,
    help='ratio of training to validation images')
parser.add_argument('--base_cfg', type=str,
    default='https://raw.githubusercontent.com/AlexeyAB/darknet/master/cfg/yolov3-tiny_obj.cfg',
    help='path or URL to base network config to modify (default: yolov3-tiny)')
args = parser.parse_args()

UNPREPARED_FILE_EXT = '.darknet-unprepared.txt'
FILE_NAMES_LIST = 'names.list'
FILE_TRAIN_LIST = 'train.list'
FILE_TEST_LIST = 'test.list'
FILE_DATA_CFG = 'data.cfg'
FILE_NETWORK_CFG = 'network.cfg'

data_dir = args.data_dir
data_files = [f for f in os.listdir(data_dir) if f.endswith(UNPREPARED_FILE_EXT)]
split_index = math.ceil(len(data_files) * args.train_test_ratio)
image_paths = [os.path.join(f.replace(UNPREPARED_FILE_EXT, '.jpg')) for f in data_files]
classes = set()
for f in data_files:
    with open(os.path.join(f), 'r') as df:
        for line in df.read().splitlines():
            classes.add(line.split(' ')[0])

data_config = [
    'classes = ' + str(len(classes)),
    'train = ' + FILE_TRAIN_LIST,
    'valid = ' + FILE_TEST_LIST,
    'names = ' + FILE_NAMES_LIST,
    'backup = backup'
]
network_config = urlopen(args.base_cfg).read().decode('utf-8')
network_config = re.sub('^batch=\d+$', 'batch=64', network_config, flags=re.MULTILINE)
network_config = re.sub('^subdivisions=\d+$', 'subdivisions=8', network_config, flags=re.MULTILINE)
network_config = re.sub('^classes=\d+$', 'classes=' + str(len(classes)), network_config, flags=re.MULTILINE)
network_config = re.sub('^filters=255$', 'filters=' + str((len(classes) + 5) * 3), network_config, flags=re.MULTILINE)

for f in data_files:
    with open(os.path.join(f), 'r') as df:
        contents = df.read()
        for i, c in enumerate(classes):
            contents = re.sub('^' + c + ' ', str(i) + ' ', contents, flags=re.MULTILINE)
        with open(os.path.join(f.replace(UNPREPARED_FILE_EXT, '.txt')), 'w') as wf:
            wf.write(contents)
with open(FILE_NAMES_LIST, 'w') as f:
    f.write('\n'.join(classes))
with open(FILE_TRAIN_LIST, 'w') as f:
    f.write('\n'.join(image_paths[:split_index]))
with open(FILE_TEST_LIST, 'w') as f:
    f.write('\n'.join(image_paths[split_index:]))
with open(FILE_DATA_CONFIG, 'w') as f:
    f.write('\n'.join(data_config))
with open(FILE_NETWORK_CFG, 'w') as f:
    f.write(network_config)
