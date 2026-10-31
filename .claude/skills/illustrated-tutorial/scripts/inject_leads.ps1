param([string]$Dir)
$enc = New-Object System.Text.UTF8Encoding($false)
# 讀取導讀：以「@@ 圖說開頭文字」為 key
$leads = [ordered]@{}
foreach ($lf in (Get-ChildItem $Dir -Filter "leads*.txt" | Sort-Object Name)) {
  $key = $null; $buf = New-Object System.Text.StringBuilder
  foreach ($line in [IO.File]::ReadAllLines($lf.FullName, [Text.Encoding]::UTF8)) {
    if ($line.StartsWith('@@ ')) {
      if ($key) { $leads[$key] = $buf.ToString().Trim() }
      $key = $line.Substring(3).Trim(); [void]$buf.Clear()
    } elseif ($key) { [void]$buf.AppendLine($line) }
  }
  if ($key) { $leads[$key] = $buf.ToString().Trim() }
}
$used = @{}; $missing = @(); $inserted = 0
foreach ($f in (Get-ChildItem $Dir -Filter "p*.html" | Sort-Object Name)) {
  $t = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8)
  $ms = [regex]::Matches($t, '(?s)<figure class="fig".*?</figure>')
  for ($i = $ms.Count - 1; $i -ge 0; $i--) {
    $m = $ms[$i]
    $cap = ([regex]::Match($m.Value, '(?s)<figcaption>(.*?)</figcaption>').Groups[1].Value -replace '<[^>]+>', '').Trim()
    $k = $leads.Keys | Where-Object { $cap.StartsWith($_) } | Select-Object -First 1
    $pos = $m.Index
    $pre = $t.Substring([Math]::Max(0, $pos - 60), [Math]::Min(60, $pos))
    $gm = [regex]::Match($pre, '<div class="grid[23]">\s*$')
    if ($gm.Success) { $pos = $pos - ($pre.Length - $gm.Index) }
    if (-not $k) { $missing += "$($f.BaseName) | grid=$($gm.Success) | $($cap.Substring(0,[Math]::Min(30,$cap.Length)))"; continue }
    $before = $t.Substring([Math]::Max(0, $pos - 400), [Math]::Min(400, $pos))
    if ($before -match 'class="look"[^<]*(<[^>]+>[^<]*)*</p>\s*$') { $used[$k] = 1; continue }  # 已插入過
    $t = $t.Insert($pos, $leads[$k] + "`r`n  ")
    $used[$k] = 1; $inserted++
  }
  [IO.File]::WriteAllText($f.FullName, $t, $enc)
}
"inserted: $inserted"
"unused keys: " + (($leads.Keys | Where-Object { -not $used.ContainsKey($_) }) -join ' || ')
"figures without lead:"; $missing
