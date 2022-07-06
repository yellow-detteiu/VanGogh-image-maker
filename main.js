let img = '';
let line_slider;
let spiral_location;
let input;
let save_button;
let colorPicker;

function setup() {
  canvas = createCanvas(windowWidth*0.5, windowHeight*0.8);
  canvas.drop(gotFile); // ドラッグ＆ドロップされた画像を取得
  frameRate(60); // randomで色がチカチカしすぎないよう、アニメーションの速度を下げる

  pixelDensity(1); // 解像度を変えたい場合は、ここをいじる
  background(0);

  textSize(30);
  fill(255, 0, 0);
  text("line_width", width * 0.75, height * 0.15);
  text("spiral_shape", width * 0.40, height * 0.15);

  // 操作用のGUIの作成
  line_slider = createSlider(0, 5, 0, 0.5);
  line_slider.position(width * 0.75, height * 0.28);
  line_slider.style("width", "200px");
  spiral_location = createSlider(0.5, 5, 1, 0.1);
  spiral_location.position(width * 0.4, height * 0.28);
  spiral_location.style("width", "200px");

  input = createFileInput(gotFile);
  input.position(width * 0.35, height * 0.13);
  input.size(150, 300);
  save_button = createButton("-- S A V E --");
  save_button.position(width * 0.55, height * 0.13);
  save_button.size(100, 30);
  save_button.mousePressed(save_file);
  colorPicker = createColorPicker("#888888");
  colorPicker.position(width * 0.35, height * 0.18);

  textSize(width / 25);
  textAlign(CENTER, CENTER);
  fill(255);
  text("ファイル選択またはドラッグ＆ドロップで画像選択", width / 2, height / 4);
  text("渦の大きさや輪郭線を変更すると、やや重くなります。", width / 2, height / 3);
  text("重いですが、大きめの画像の方が絵画っぽくなります。", width / 2, height / 2.4);

  if(img) {
    background(255/2);
    resizeCanvas(img.width, img.height);
  }
}

function draw() {
    if (img) {

      // canvasの大きさを画像の大きさに変更
      resizeCanvas(img.width, img.height)

      // 線の色
      let line_color = colorPicker.value();

      // 線の太さ
      let line_width = line_slider.value();

      // 渦の位置
      let spiral_shape = spiral_location.value();

      stroke(line_color);
      strokeWeight(line_width);
      rectMode(CENTER);
      blendMode(BLEND);

      //image(img, 0, 0);

      for(let j = 0; j < height; j += size) {
        for(let i = 0; i < width; i += size) {
          let location = new createVector(random(width), random(height));
          // 指定した場所の色を指定する
          let col = img.get(int(location.x), int(location.y));
          let r = red(col) + random(-50, 50);
          let g = green(col) + random(-50, 50);
          let b = blue(col) + random(-50, 50);
          fill(r, g, b, random(50, 200));

          // 明るさを計算する
          let brightness = red(col) + green(col) + blue(col);

          // 中心からの位置
          let loc_x = location.x - width / 2;
          let loc_y = location.y - height / 2;

          // 明るさから角度を計算
          let angle = map(Math.abs(loc_x + loc_y)*spiral_shape, 0, width + height, -PI, PI);

          // 明るさから四角形の長さを設定する
          let length = map(255 * 3 - brightness, 0, 255 * 3, 20, 40);

          // ストロークの幅
          let thickness = map(255 * 3 - brightness, 0, 255 * 3, 5, 15);

          // 設定した角度と長さで四角形を描く
          push();
          translate(location.x, location.y);
          rotate(angle);
          ellipse(0, 0, length, thickness);
          pop();
          
          // やや油絵風にするための工夫

          // 影の元の位置からの距離
          let shadow_dict = random(-5, 5);

          // 影の位置
          let shadow_loc = new createVector(location.x+shadow_dict, location.y+shadow_dict);

          // 影の色
          let shadow_strength = map(5-Math.abs(shadow_dict), 0, 5, 0.3, 1); // 0に近いほど強い。元の位置に近いほど濃くする
          let shadow_color = [
            r * shadow_strength,
            g * shadow_strength,
            b * shadow_strength,
          ];
          fill(shadow_color, random(50, 200));

          // 影を描画
          if (i % 50 == 0) {
            push();
            translate(shadow_loc.x, shadow_loc.y);
            rotate(angle);
            ellipse(0, 0, length * 0.7, thickness * 0.5);
            pop();
          }

          // ハイライトの元の位置からの距離
          let highlight_dict = random(-5, 5);

          // ハイライトの位置
          let highlight_loc = new createVector(location.x+highlight_dict, location.y+highlight_dict);

          // ハイライトの色
          let highlight_strength = map(5-Math.abs(shadow_dict), 0, 5, 1, 1.7); // 大きいほど強い。元の位置に近いほど濃くする
          let highlight_color = [
            r * highlight_strength,
            g * highlight_strength,
            b * highlight_strength,
          ];
          fill(highlight_color, random(50, 200));

          // ハイライトを描画
          if (i % 50 == 0) {
            push();
            translate(highlight_loc.x, highlight_loc.y);
            rotate(angle);
            ellipse(0, 0, length * 0.5, thickness * 0.7);
            pop();
          }
        }
      }
    }
}


function gotFile(file) {
  img = loadImage(file.data, '');
}

// inputから投稿したファイルの処理
function handleFile(file) {
  print(file);
  if (file.type === "image") {
    img = createImg(file.data, "");
    img.hide();
  } else {
    img = null;
  }
}

function save_file() {
    saveCanvas("myImage", "png");
}

