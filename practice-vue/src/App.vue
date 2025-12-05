<script setup>
const heroTitle = 'Vue 練習ホーム画面';
const heroSubtitle = '軽くプロジェクト構成を理解し、コンポーネントを拡張してみましょう。';

const quickLinks = [
  {
    id: 'guide',
    label: 'Vue 公式ガイド',
    description: '主要概念とサンプルを素早く確認',
    href: 'https://vuejs.org/guide/introduction.html',
  },
  {
    id: 'examples',
    label: 'サンプルコンポーネント',
    description: '実装アイデアが得られるベストプラクティス',
    href: 'https://vuejs.org/examples/#hello-world',
  },
];
</script>

<template>
  <!-- ホーム画面全体をまとめるメインコンテナ -->
  <main class="home">
    <section class="hero">
      <p class="eyebrow">プラクティス Vue</p>
      <h1>{{ heroTitle }}</h1>
      <p class="lead">{{ heroSubtitle }}</p>
      <div class="hero-actions">
        <a class="primary" href="https://vitejs.dev/guide/" target="_blank" rel="noreferrer">
          スターターガイドを見る
        </a>
        <a class="secondary" href="https://vuejs.org/" target="_blank" rel="noreferrer">
          Vue 公式サイトへ
        </a>
      </div>
    </section>

    <section class="cards">
      <h2>クイックスタートリンク</h2>
      <div class="grid">
        <article v-for="item in quickLinks" :key="item.id" class="card">
          <h3>{{ item.label }}</h3>
          <p>{{ item.description }}</p>
          <a :href="item.href" target="_blank" rel="noreferrer">すぐに開く →</a>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 3rem 1.5rem 4rem;
  max-width: 960px;
  margin: 0 auto;
}

.hero {
  background: linear-gradient(145deg, #2a72f8, #7c3aed);
  border-radius: 24px;
  padding: 3rem;
  color: #fff;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.25);
}

.eyebrow {
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  opacity: 0.9;
}

.hero h1 {
  font-size: clamp(2.75rem, 6vw, 3.6rem);
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.2rem;
  max-width: 540px;
  opacity: 0.95;
}

.hero-actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.hero a {
  text-decoration: none;
  font-weight: 600;
}

.primary,
.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  transition: transform 150ms ease, opacity 150ms ease;
}

.primary {
  background-color: #fff;
  color: #1c1c34;
}

.secondary {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.primary:hover,
.secondary:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.cards h2 {
  font-size: 1.35rem;
  margin-bottom: 1.25rem;
  color: #1b1b33;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.card h3 {
  font-size: 1.1rem;
  color: #111122;
}

.card p {
  color: #4c4c63;
  flex: 1;
}

.card a {
  font-weight: 600;
  color: #2a72f8;
  text-decoration: none;
}

.card a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .hero {
    padding: 2rem;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>
