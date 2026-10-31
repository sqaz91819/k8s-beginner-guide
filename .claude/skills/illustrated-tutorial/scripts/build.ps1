param(
  [Parameter(Mandatory = $true)][string]$Parts,   # 存放 p00_head.html … p99_tail.html 的資料夾
  [Parameter(Mandatory = $true)][string]$Out,     # 輸出的單一 HTML 檔
  [string]$Preview                                # 選填：同時輸出一份到預覽伺服器的根目錄（例如 <scratchpad>\site\index.html）
)
# 依檔名排序串接所有 p*.html，以 UTF-8（無 BOM）寫出。PowerShell 5.1 的 Set-Content 預設不是 UTF-8，所以改用 .NET API。
$sb = New-Object System.Text.StringBuilder
Get-ChildItem $Parts -Filter "p*.html" | Sort-Object Name | ForEach-Object {
  [void]$sb.Append([IO.File]::ReadAllText($_.FullName, [Text.Encoding]::UTF8))
}
$enc = New-Object System.Text.UTF8Encoding($false)
$html = $sb.ToString()
[IO.File]::WriteAllText($Out, $html, $enc)
if ($Preview) {
  New-Item -ItemType Directory -Force (Split-Path $Preview) | Out-Null
  [IO.File]::WriteAllText($Preview, $html, $enc)
}
$figs = ([regex]::Matches($html, '<figure class="fig"')).Count
$looks = ([regex]::Matches($html, '<p class="look"')).Count
$guides = ([regex]::Matches($html, '<div class="yg">')).Count
"built: $Out  ($([Math]::Round($html.Length / 1KB)) KB)"
"figures: $figs | look hints: $looks | yaml guides: $guides"
