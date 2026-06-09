# 泡泡爪宠物洗护店

宠物洗护店展示网站，预约系统基于 Supabase。

## 快速开始

### 1. Supabase 设置

1. 创建 Supabase 项目
2. 在 SQL Editor 执行：

```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_name TEXT NOT NULL,
  pet_type TEXT NOT NULL,
  service TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert" ON appointments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow admin access" ON appointments FOR ALL TO anon USING (true) WITH CHECK (true);
```

3. 在 `src/config.js` 填入你的 Supabase URL 和 Key

### 2. 本地开发

直接用浏览器打开 `index.html` 即可预览。

### 3. 部署

#### GitHub Pages

1. 推送代码到 GitHub
2. 在仓库 Settings → Pages
3. Source 选择 `main` 分支 `/` 目录
4. 访问 `https://你的用户名.github.io/仓库名`

#### Vercel（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 无需额外配置，自动部署

## 项目结构

```
petshop/
├── index.html        # 主页面
├── admin.html      # 管理后台
├── styles.css     # 样式
├── pet-spa.svg   # 图片
├── src/
│   ├── config.js       # Supabase 配置
│   ├── app.js       # 前端逻辑
│   ├── lib/
│   │   └── supabase.js  # 数据库操作
│   └── admin.js    # 管理后台逻辑
└── .gitignore
```

## 功能

- [x] 在线预约提交
- [x] 预约数据存储到 Supabase
- [x] 管理后台查看/处理预约