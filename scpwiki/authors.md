<style>
    .creator-card {
        text-align: center;
        color: var(--text-color, inherit);
    }
    .creator-name {
        font-weight: bold;
        font-size: 1.2em;
        margin-bottom: 4px;
        color: var(--text-color, inherit);
    }
    .creator-role {
        color: var(--text-secondary, #888);
        opacity: 0.8;
    }
    .creators-grid {
        display: flex;
        justify-content: center;
        gap: 34px;
        flex-wrap: wrap;
        margin-top: 38px;
    }
    .creator-image {
        width: 88px;
        height: 88px;
        object-fit: cover;
        display: block;
        margin: 0 auto 12px;
        border-radius: 50%;
    }
    
    h1 {
        margin: 0;
        font-size: 2.5rem;
        text-align: center;
        font-weight: 600;
        border: none !important;
        padding: 0 !important;
    }

    @media (max-width: 768px) {
        .creators-grid {
            gap: 24px;
            margin-top: 24px;
        }
        .creator-image {
            width: 72px;
            height: 72px;
        }
        .creator-name {
            font-size: 1.1em;
        }
    }
    @media (max-width: 480px) {
        .creators-grid {
            gap: 20px;
            margin-top: 20px;
            flex-direction: column;
            align-items: center;
        }
        .creator-card {
            width: 100%;
            max-width: 280px;
        }
    }
</style>

<h1>Authors of SCP Wiki</h1>

<div class="creators-grid">
    <div class="creator-card">
        <img src="../img/adasjusk.png" alt="adasjusk" class="creator-image">
        <div class="creator-name">adasjusk</div>
        <div class="creator-role">Owner & Developer</div>
    </div>
    <div class="creator-card">
        <img src="../img/superchicken.png" alt="SuperChicken" class="creator-image">
        <div class="creator-name">SuperChicken</div>
        <div class="creator-role">Helper & Administrator</div>
    </div>
</div>