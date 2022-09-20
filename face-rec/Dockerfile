FROM animcogn/face_recognition:cpu-latest

WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD [ "python3", "app.py" ]

