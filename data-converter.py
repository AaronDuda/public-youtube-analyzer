import csv
import numpy as np
import re

with open('videos.csv', mode='w', newline='', encoding='utf-8') as videos, open('related.csv', mode='w', newline='', encoding='utf-8') as related:
    videos_writer = csv.writer(videos)
    related_writer = csv.writer(related)
    videos_writer.writerow(['ID', 'uploader', 'age', 'category', 'length', 'views', 'rate', 'ratings', 'comments'])
    related_writer.writerow(['START_ID', 'END_ID'])

    for i in range(0,4):
        with open(f'youtube-crawl/080327/{i}.txt', mode='r', newline='', encoding='utf-8') as youtube:
            line = youtube.readline()
            while line:
                line_list = re.split(r'[\t\n\r\f\v]+', line)
                line_list.pop()
                id = line_list[0]
                end_attribute = min(len(line_list), 9)
                attributes = line_list[:end_attribute]
                related = np.array(line_list[end_attribute:])
                if attributes:
                    videos_writer.writerow(attributes)
                if related.any():
                    related_writer.writerows(np.column_stack((np.full(related.shape, id), related)))
                line = youtube.readline()
