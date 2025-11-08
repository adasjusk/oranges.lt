// Status Checker JavaScript for Orange Status Page with SCPList Integration

class StatusChecker {
    constructor() {
        this.servers = {
            scp: {
                serverId: '94815',
                type: 'scp'
            },
            mcJava: {
                host: 'mc.oranges.lt',
                port: 25565,
                type: 'minecraft-java'
            },
            mcBedrock: {
                host: 'play.oranges.lt',
                port: 19132,
                type: 'minecraft-bedrock'
            }
        };
        
        this.lastUpdate = null;
        this.checkInterval = 30000; // 30 seconds
        this.timeoutDuration = 5000; // 5 seconds timeout
        
        this.init();
    }

    init() {
        this.checkAllServers();
        this.startAutoRefresh();
        this.updateLastUpdatedTime();
    }

    async checkAllServers() {
        const promises = [];
        
        // Check SCP server
        promises.push(this.checkSCPServer());
        
        // Check Minecraft servers  
        promises.push(this.checkMinecraftJava());
        promises.push(this.checkMinecraftBedrock());
        
        await Promise.all(promises);
        
        this.lastUpdate = new Date();
        this.updateLastUpdatedTime();
    }

    async checkSCPServer() {
        const statusEl = document.getElementById('scp-status');
        
        try {
            statusEl.className = 'status-indicator checking';
            
            // Remove any previous manual check notes
            const statusItem = statusEl.closest('.status-item');
            const existingNote = statusItem?.querySelector('.manual-check-note');
            if (existingNote) {
                existingNote.remove();
            }
            
            const startTime = Date.now();
            
            // Try different methods to access SCPList API (CORS handling)
            const apis = this.getSCPApiEndpoints();
            
            let data = null;
            let lastError = null;
            let ping = 0;
            
            for (let i = 0; i < apis.length; i++) {
                const apiUrl = apis[i];
                const attemptStartTime = Date.now();
                
                try {
                    console.log(`Attempting SCPList API call ${i + 1}/${apis.length}: ${apiUrl}`);
                    
                    const headers = {};
                    if (apiUrl.includes('api.scplist.kr')) {
                        headers['accept'] = 'application/json;charset=UTF-8';
                    }
                    
                    const response = await this.fetchWithTimeout(apiUrl, 12000, headers);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    data = await response.json();
                    ping = Date.now() - attemptStartTime;
                    
                    console.log(`SCPList API success on attempt ${i + 1}:`, data);
                    break;
                    
                } catch (error) {
                    console.warn(`SCPList API attempt ${i + 1} failed:`, error.message);
                    lastError = error;
                    
                    // Don't continue if it's clearly a network issue
                    if (error.name === 'AbortError' || error.message.includes('fetch')) {
                        continue;
                    }
                }
            }
            
            if (!data) {
                throw lastError || new Error('All SCPList API methods failed');
            }
            
            console.log('SCPList API response:', data);
            
            // Parse the SCPList response format
            const isOnline = data.online === true;
            
            // Update display based on SCPList data
            if (isOnline) {
                statusEl.className = 'status-indicator online';
                
                // Remove any error notes if check is successful
                const statusItem = statusEl.closest('.status-item');
                const existingNote = statusItem?.querySelector('.manual-check-note');
                if (existingNote) {
                    existingNote.remove();
                }
            } else {
                statusEl.className = 'status-indicator offline';
            }
            
            console.log('SCP Server SCPList check successful:', { 
                online: isOnline,
                version: data.version,
                ip: data.ip,
                port: data.port
            });
            
        } catch (error) {
            console.error('SCP server SCPList check failed:', error);
            
            // Show error state
            statusEl.className = 'status-indicator offline';
        }
    }

    getSCPApiEndpoints() {
        const baseUrl = 'https://api.scplist.kr/api/servers/94815';
        const proxies = [
            'https://api.allorigins.win/raw?url=' + encodeURIComponent(baseUrl),
            'https://cors.isomorphic-git.org/' + baseUrl
        ];
        const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
        return isLocal ? [baseUrl, ...proxies] : [...proxies, baseUrl];
    }

    async checkMinecraftJava() {
        const statusEl = document.getElementById('mc-java-status');
        
        try {
            statusEl.className = 'status-indicator checking';
            
            const startTime = Date.now();
            
            // Try multiple API services in sequence for better reliability
            const apis = [
                `https://api.mcsrvstat.us/3/mc.oranges.lt`,
                `https://api.mcstatus.io/v2/status/java/mc.oranges.lt`,
                `https://mcapi.us/server/status?ip=mc.oranges.lt`
            ];
            
            let lastError = null;
            
            for (const apiUrl of apis) {
                try {
                    const response = await this.fetchWithTimeout(apiUrl, 10000);
                    if (!response.ok) continue;
                    
                    const data = await response.json();
                    
                    // Handle different API response formats
                    let isOnline = false;
                    
                    if (apiUrl.includes('mcsrvstat.us')) {
                        isOnline = data.online === true;
                    } else if (apiUrl.includes('mcstatus.io')) {
                        isOnline = data.online === true;
                    } else if (apiUrl.includes('mcapi.us')) {
                        isOnline = data.status === 'success' && data.online === true;
                    }
                    
                    if (isOnline) {
                        statusEl.className = 'status-indicator online';
                        return;
                    } else {
                        // API responded but server is offline
                        statusEl.className = 'status-indicator offline';
                        return;
                    }
                } catch (error) {
                    lastError = error;
                    continue; // Try next API
                }
            }
            
            // All APIs failed
            throw lastError || new Error('All APIs failed');
            
        } catch (error) {
            statusEl.className = 'status-indicator offline';
            console.error('Minecraft Java check error:', error);
        }
    }

    async checkMinecraftBedrock() {
        const statusEl = document.getElementById('mc-bedrock-status');
        
        try {
            statusEl.className = 'status-indicator checking';
            
            const startTime = Date.now();
            
            // Try multiple API services for Bedrock
            const apis = [
                `https://api.mcsrvstat.us/bedrock/3/play.oranges.lt:19132`,
                `https://api.mcstatus.io/v2/status/bedrock/play.oranges.lt:19132`,
                `https://mcapi.us/server/status?ip=play.oranges.lt&port=19132`
            ];
            
            let lastError = null;
            
            for (const apiUrl of apis) {
                try {
                    const response = await this.fetchWithTimeout(apiUrl, 10000);
                    if (!response.ok) continue;
                    
                    const data = await response.json();
                    
                    // Handle different API response formats
                    let isOnline = false;
                    
                    if (apiUrl.includes('mcsrvstat.us')) {
                        isOnline = data.online === true;
                    } else if (apiUrl.includes('mcstatus.io')) {
                        isOnline = data.online === true;
                    } else if (apiUrl.includes('mcapi.us')) {
                        isOnline = data.status === 'success' && data.online === true;
                    }
                    
                    if (isOnline) {
                        statusEl.className = 'status-indicator online';
                        return;
                    } else {
                        // API responded but server is offline
                        statusEl.className = 'status-indicator offline';
                        return;
                    }
                } catch (error) {
                    lastError = error;
                    continue; // Try next API
                }
            }
            
            // All APIs failed
            throw lastError || new Error('All APIs failed');
            
        } catch (error) {
            statusEl.className = 'status-indicator offline';
            console.error('Minecraft Bedrock check error:', error);
        }
    }

    async fetchWithTimeout(url, timeout = 5000, headers = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                mode: 'cors',
                cache: 'no-cache',
                headers: headers
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    startAutoRefresh() {
        setInterval(() => {
            this.checkAllServers();
        }, this.checkInterval);
    }

    updateLastUpdatedTime() {
        const lastUpdatedEl = document.getElementById('last-updated');
        if (this.lastUpdate) {
            lastUpdatedEl.textContent = this.lastUpdate.toLocaleTimeString();
        } else {
            lastUpdatedEl.textContent = 'Never';
        }
    }

    // Manual refresh function
    async refreshStatus() {
        const button = document.querySelector('.cta-btn');
        const originalText = button.textContent;
        
        button.textContent = 'Refreshing...';
        button.disabled = true;
        
        await this.checkAllServers();
        
        button.textContent = originalText;
        button.disabled = false;
        
        // Show refresh animation
        button.style.transform = 'scale(1.05)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }
}

// Global refresh function for the button
function refreshStatus() {
    if (window.statusChecker) {
        window.statusChecker.refreshStatus();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.statusChecker = new StatusChecker();
});

// Add error handling for failed requests
window.addEventListener('error', (event) => {
    console.error('Status page error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
