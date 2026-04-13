$git = "C:\Program Files\Git\cmd\git.exe"
& $git config user.email "cybersafe1900@gmail.com"
& $git config user.name "cybersafe"
& $git remote add origin https://github.com/virti310/cybersafe.git
& $git add .
& $git commit -m "Initial commit"
& $git branch -M main
Write-Host "Pushing to GitHub..."
& $git push -u origin main --force
