
## 1️⃣ **Development (Local) - User Secrets** ✅ RECOMANDAT

### Setup inițial (o singură dată):

```bash
cd ../NeuroBridge/Backend/NeuroBridgeBackend/NeuroBridgeBackend

# Inițializează User Secrets pentru proiect
dotnet user-secrets init

# Setează cheia API
dotnet user-secrets set "Gemini:ApiKey" "valoare"
```

### Verificare:
```bash
# Vizualizează secretele stocate
dotnet user-secrets list
```

### Unde se stochează?
- **macOS/Linux:** `~/.microsoft/usersecrets/<UserSecretsId>/secrets.json`
- **Windows:** `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\secrets.json`
- Nu e versioned în git ✅

### În `Program.cs`:
Deja configurat - `builder.Configuration` citește automat din User Secrets!

---

## 2️⃣ **Production - Environment Variables** ✅ PENTRU DEPLOYMENT

### Linux/macOS/Docker:
```bash
export Gemini__ApiKey="valoare"
dotnet run
```

### Windows PowerShell:
```powershell
$env:Gemini__ApiKey="valoare"
dotnet run
```

### Docker Compose:
```yaml
environment:
  - Gemini__ApiKey=valoare
```

### Kubernetes/Azure:
```yaml
secretKeyRef:
  name: gemini-secrets
  key: api-key
```

---

## 4️⃣ **Testing - verifică dacă funcționează** ✅

```bash
# Setează secret local
dotnet user-secrets set "Gemini:ApiKey" "valoare"

# Lansează app
dotnet run

# Testează endpoint
curl -X POST https://localhost:5001/api/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": 1,
    "contentText": "Test content",
    "numberOfQuestions": 3,
    "difficulty": "EASY"
  }'
```

---

## ⚠️ **Checklist Securitate**

- ✅ API key REMOVATĂ din `appsettings.json`
- ✅ API key REMOVATĂ din `appsettings.Development.json`
- ✅ `.gitignore` conține `*.env`
- ✅ `secrets.json` nu e tracked în git
- ✅ Nu stochezi API keys în environment variables pe macbook local
- ✅ Folosești User Secrets pentru development
- ✅ Nu faci commit cu cheia în code

---

## 🔍 **Debugging - daca nu merge**

```bash
# Verifica care source e folosit
dotnet run --verbose

# Verifica User Secrets
dotnet user-secrets list

# Verifica environment var
echo $Gemini__ApiKey  # sau
printenv | grep Gemini
```

---

## 🚨 **DACA cheia a fost EXPOSATA**

1. **Imediat:** Revocă cheia veche în Google Cloud Console
2. Creează o nouă cheie
3. Setează noua cheie: `dotnet user-secrets set "Gemini:ApiKey" "NEW_KEY"`
4. Nu faci `git push` cu cheia veche!
5. Adaugă la commit message: "Revoked exposed API key"

---

## 📚 Resurse
- [ASP.NET User Secrets](https://docs.microsoft.com/aspnet/core/security/app-secrets)
- [Configuration in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/configuration)
- [Google API Key Best Practices](https://cloud.google.com/docs/authentication/best-practices)
