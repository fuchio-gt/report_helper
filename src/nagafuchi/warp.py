import sys
import cv2
from PIL import Image
import base64
import matplotlib.pyplot as plt
from io import BytesIO

import numpy as np

img_base64 = sys.stdin.readline()
# frame = cv2.imread('sample.jpg').copy()
# nodeからbase64で画像を取得
img_binary = base64.b64decode(img_base64)
jpg=np.frombuffer(img_binary,dtype=np.uint8)

#raw image <- jpg
frame = cv2.imdecode(jpg, cv2.IMREAD_COLOR)


gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
ret, th = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
# 輪郭検出
contours, hierarchy = cv2.findContours(
    th, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# 面積が最大のものだけ取り出す
areas = [cv2.contourArea(cnt) for cnt in contours]
area = max(areas)
cnt = contours[areas.index(area)]
epsilon = 0.1*cv2.arcLength(cnt, True)
approx = cv2.approxPolyDP(cnt, epsilon, True)

img_contour = cv2.drawContours(frame, [approx], -1, (255, 0, 0), 3)

# 射影変換
dst_size = [595, 842]   # 射影変換後の画像サイズ
dst = []
pts1 = np.array(approx, dtype='float32')   # 抽出したモニタ領域の四隅の座標
pts2 = np.array([[0, 0], [0, dst_size[1]], [dst_size[0], dst_size[1]], [
                dst_size[0], 0]], dtype='float32')   # 射影変換後の四隅の座標

# ホモグラフィ行列を求め、射影変換する
M = cv2.getPerspectiveTransform(pts1, pts2)
dst = cv2.warpPerspective(cv2.cvtColor(
    th, cv2.COLOR_BGR2RGB), M, (dst_size[0], dst_size[1]))

cv2.imwrite('./test.jpg', dst)

plt.imshow(dst)
# plt.show()

pil_image = cv2.cvtColor(dst, cv2.COLOR_BGR2RGB)
pil_image = Image.fromarray(pil_image)
pil_image = pil_image.convert('RGB')

out_file = 'test.pdf'

pil_image.save(out_file)

print(out_file)