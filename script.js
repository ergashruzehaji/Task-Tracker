<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2575.7">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">const form = document.getElementById('task-form');</p>
<p class="p1">const input = document.getElementById('task-input');</p>
<p class="p1">const list = document.getElementById('task-list');</p>
<p class="p2"><br></p>
<p class="p1">form.addEventListener('submit', function(e) {</p>
<p class="p1"><span class="Apple-converted-space">  </span>e.preventDefault(); // Prevent page reload</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>const taskText = input.value.trim();</p>
<p class="p1"><span class="Apple-converted-space">  </span>if (taskText === '') return;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>const li = document.createElement('li');</p>
<p class="p1"><span class="Apple-converted-space">  </span>li.textContent = taskText;</p>
<p class="p1"><span class="Apple-converted-space">  </span>list.appendChild(li);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>input.value = ''; // Clear input</p>
<p class="p1">});</p>
</body>
</html>
