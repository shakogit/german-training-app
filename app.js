document.addEventListener('DOMContentLoaded', () => {
  loadTopics();
});

async function loadTopics() {
  const container = document.getElementById('topics-grid');

  try {
    const response = await fetch('./data/topics.json');
    if (!response.ok) throw new Error('Failed to load topics');
    
    const topics = await response.json();
    container.innerHTML = ''; // Clear loading state

    topics.forEach(topic => {
      const card = document.createElement('div');
      card.className = 'topic-card';
      card.onclick = () => {
        // Redirect to quiz page with selected topic ID
        window.location.href = `quiz.html?topic=${topic.id}`;
      };

      card.innerHTML = `
        <div class="card-header">
          <span class="topic-icon">${topic.icon}</span>
          <span class="topic-level">${topic.level}</span>
        </div>
        <h3 class="topic-title">${topic.title}</h3>
        <p class="topic-description">${topic.description}</p>
        <button class="start-btn">Start Practice ➔</button>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading topics:', error);
    container.innerHTML = `<p class="error-msg">⚠️ Unable to load topics. Please try again later.</p>`;
  }
}
