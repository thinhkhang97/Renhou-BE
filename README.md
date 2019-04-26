# Renhou-BE
Renhou-BE is backend of Renhou mobile application.
This is a update.

# Use APIs
## Các request có phần body thì trong body phải có trường userId
## Các request không có body như GET thì trên URI thì:
- userId đã được truyền như param rồi thì khỏi thêm gì hết, ví dụ 
> userId là 5cb7f1498c71302068eadc82
```sh
localhost:3000/room/all/5cb7f1498c71302068eadc82
```
- nếu chưa có thì phải truyền vào dưới dạng tham số querry, ví dụ
> userId là 5cb7f1498c71302068eadc82
```sh
localhost:3000/room/5cbbefeb6c58c82b0cb39664?userId=5cb7f1498c71302068eadc82
```
# API LOGIN
- Sau khi login thành công sẽ trả về userID và token.
- Token này dùng ?? truyền vào header của request dưới dạng 
> Authorization: Bearer token.
- Nếu không có token, gọi API sẽ nhận được "Unauthorize"

# Test use Postman
## B1: Chạy postman
## B2: Import file .json trong Renhou-BE/postman
## B3: Chọn API để test và Send

# Build document

## Requirement:
- Nodejs https://nodejs.org/en/
- MongoDB https://www.mongodb.com/download-center/community

## Build and Run
- Có thể tải robo3t để theo dõi database trực quan hơn. https://robomongo.org/

- Nếu mongodb không khởi động mặc định, start nó bằng tay:

> Đối với Unbuntu
```sh
sudo service mongod start
```
> Đối với Window, mở cmd quyền admin
```sh
net start MongoDB
```

- Vào đường dẫn thư mục Renhou-BE mở terminal hoặc cmd và chuyển đến thư mục src

```sh
cd src
```

- Install package cần thiết:

```sh
npm install
```

- Chạy server

```sh
npm start
```
