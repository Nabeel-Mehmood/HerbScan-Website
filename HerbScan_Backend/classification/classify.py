# classification/classify.py
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TF debug logs

import sys
import json
import numpy as np
import tensorflow as tf
from PIL import Image