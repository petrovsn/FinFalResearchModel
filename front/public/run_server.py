#!/usr/bin/env python3
import json
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import argparse
import functools



parser = argparse.ArgumentParser(description='Add user')
parser.add_argument('-d', '--dir', type=str, help='path to html directory')
parser.add_argument('-p', '--port', type=int, help='port of finfal_rc-web')

args = parser.parse_args()

directory = args.dir
port = args.port

Handler = functools.partial(SimpleHTTPRequestHandler, directory=directory)

os.chdir(directory)
httpd = HTTPServer(("0.0.0.0", port), SimpleHTTPRequestHandler)
httpd.serve_forever()
