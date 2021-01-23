# report_helper
サポーターズ ウインターハッカソンVol.6

# Dockerの環境構築
1. リポジトリをクローンする
1. `docker-compose build`でビルドする
1. `docker image ls`でイメージ(kasahara_app)が作成されていることを確認する
1. `docker-compose up -d`でコンテナ作成と開始をバックグランドで実行する
1. `docker ps`でプロセスがあることを確認する
1. `docker exec -it hackathon /bin/sh`でコンテナに入る
1. なんかやる
1. ブラウザで`localhost:3000`にアクセスする
