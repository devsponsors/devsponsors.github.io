// Dynamic Stats Loader for DevSponsors
// Reads data/devs.json and updates stats across all pages automatically

(function() {
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  function toFa(n) {
    if (n === null || n === undefined) return '۰';
    return n.toString().replace(/\d/g, d => faDigits[d]);
  }

  fetch('data/devs.json')
    .then(r => r.json())
    .then(data => {
      const devs = data.developers || [];
      if (!devs.length) return;

      // Calculate totals
      let totalStars = 0;
      let totalFollowers = 0;
      let totalRepos = 0;
      let totalCommits30d = 0;

      devs.forEach(d => {
        totalStars += (d.total_stars || 0);
        totalFollowers += (d.followers || 0);
        totalRepos += (d.public_repos || 0);
        if (d.activity_30d) {
          totalCommits30d += (d.activity_30d.commits_count || 0);
        }
      });

      // Update counters on current page if elements exist
      document.querySelectorAll('[data-dynamic="total-stars"]').forEach(el => {
        el.innerText = toFa(totalStars.toLocaleString('en-US')) + '+';
      });

      document.querySelectorAll('[data-dynamic="total-followers"]').forEach(el => {
        el.innerText = toFa(totalFollowers.toLocaleString('en-US')) + '+';
      });

      document.querySelectorAll('[data-dynamic="total-repos"]').forEach(el => {
        el.innerText = toFa(totalRepos.toLocaleString('en-US')) + '+';
      });

      document.querySelectorAll('[data-dynamic="total-commits-30d"]').forEach(el => {
        el.innerText = toFa(totalCommits30d.toLocaleString('en-US')) + '+';
      });

      // Update counter animation targets if on index page
      document.querySelectorAll('.counter').forEach(c => {
        const targetType = c.getAttribute('data-stat');
        if (targetType === 'stars') c.setAttribute('data-target', totalStars);
        if (targetType === 'followers') c.setAttribute('data-target', totalFollowers);
        if (targetType === 'repos') c.setAttribute('data-target', totalRepos);
      });

    })
    .catch(err => {
      console.warn('DevSponsors dynamic loader:', err);
    });
})();
