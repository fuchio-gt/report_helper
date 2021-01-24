# Dockerの環境構築
1. リポジトリをクローンする
1. deployディレクトリに移動して，`docker-compose build`でビルドする
1. `docker image ls`でイメージ(deploy_app)が作成されていることを確認する
1. `docker-compose up -d`でコンテナ作成と開始をバックグランドで実行する
1. `docker ps`でプロセスがあることを確認する
1. `docker exec -it report-helper /bin/sh`でコンテナに入る
1. `node index.js`を実行
1. URLをLINEのWebhookに追加
