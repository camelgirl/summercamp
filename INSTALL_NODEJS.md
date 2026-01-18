# Install Node.js and npm on macOS

## Option 1: Official Installer (Easiest - Recommended) ⭐

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Choose the macOS installer (.pkg file)

2. **Install:**
   - Double-click the downloaded .pkg file
   - Follow the installation wizard
   - This will install both Node.js and npm

3. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

4. **Restart your terminal** after installation

---

## Option 2: Install Homebrew First, Then Node.js

### Step 1: Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. This may take a few minutes.

### Step 2: Install Node.js

```bash
brew install node
```

### Step 3: Verify

```bash
node --version
npm --version
```

---

## Option 3: Using nvm (Node Version Manager)

### Step 1: Install nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Step 2: Reload your shell

```bash
source ~/.zshrc
# or
source ~/.bash_profile
```

### Step 3: Install Node.js

```bash
nvm install --lts
nvm use --lts
```

### Step 4: Verify

```bash
node --version
npm --version
```

---

## After Installation

Once Node.js and npm are installed, you can:

1. **Install project dependencies:**
   ```bash
   cd /Users/yinyanhe/Documents/summercamp
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

3. **Access your app:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

---

## Quick Check

Run these commands to verify installation:

```bash
node --version   # Should show v18.x.x or v20.x.x
npm --version    # Should show 9.x.x or 10.x.x
```

---

## Troubleshooting

### Command not found after installation
- **Restart your terminal** or run: `source ~/.zshrc`
- Check PATH: `echo $PATH`

### Permission errors
- Don't use `sudo` with npm
- If needed, fix npm permissions: `npm config set prefix ~/.npm-global`

### Still having issues?
- Check Node.js installation: `which node`
- Check npm installation: `which npm`
- Reinstall if needed using one of the methods above
