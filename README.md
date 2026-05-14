# Meme Biome Keeper

**Meme Biome Keeper**, Base ağında (Base Mainnet) çalışan, "Meme biology", "biomeme evolution", "viral mutation management" ve "meme ecosystem orchestration" yeteneklerine odaklanmış tam etkileşimli, bağımlılık yapan ve on-chain entegre bir ekosistem yönetim oyunudur.

Oyun, ERC-8021 Transaction Attribution ve ERC-8004 Trustless Agents özellikleriyle tam entegre bir yapıda çalışacak şekilde tasarlanmıştır. Meme Biome Orchestrator adlı AI agent ile entegre olan bu ekosistem, Meme Biome Keeper dünyanızı yönetmenize, kaydetmenize ve etkileşim kurmanıza olanak tanır.

## Özellikler

- **Meme Ecosystem Orchestration:** Hype, Memetic Energy, Chaos Level ve Virality elementlerini dengeleyerek kendi biomunuzu oluşturun!
- **Karakterler:** Doge, Pepe, Chad, Wojak, Apu, Gigachad gibi memeleri uygun noktalara konumlandırarak etkileşimlerini yönetin.
- **On-chain Etkileşim (Base Mainnet):** 
  - **"Say GM"**: ERC-8021 ile attribution bilgilerini içeren gerçek on-chain işlem özelliği. 
  - **Biome Recording**: Base mainnet üzerindeki biom durumunuzu SIWE signature aracılığıyla blockchain üzerinde onaylama özelliği.
- **ERC-8004 Agent Integration:** Meme Biom Orchestrator sistemleri, akıllı kontratlarınızın ve biome ilerlemelerinizin güvenle orkestre edilmesini sağlar. Model Context Protocol (MCP) üzerinden komut alır ve otonom sistem simülasyonlarıyla biom durumunu yönetebilir.

## Kurulum ve API'ler

- **Frontend:** React, Zustand (store yönetimi), Canvas (simülasyonlar) ve Wagmi / Viem Web3 entegrasyonu ile geliştirildi. TailwindCSS ve Framer Motion ile görsellik sağlandı.
- **Backend / MCP Server:** Express + Vite kullanılarak tam entegre sunulmuştur. MCP komutlarına yanıt veren endpointler eklendi (`/api/mcp` vb.).

### Agent API İletişimi:
Meme Biom Orchestrator, aşağıdaki endpoint'ler ile hizmet verir:
- `/.well-known/agent-card.json`: A2A ve temel agent meta bilgileri
- `/api/mcp`: Model Context Protocol uç noktası
- `/api/agent`: Basit agent iletişim ve orkestrasyon bilgisi

## Hassas Bilgiler

> **Güvenlik Notu:**
> 
> Bu depo içerisinde, **özel anahtarlar (Private Keys)** veya **API anahtarları** yer **ALMAMALIDIR**.
> Eğer yerel kurulum yapılacaksa `.env` dosyası .gitignore altında kalmalıdır (Zaten `.env.example` bulunmaktadır).
>
> Projedeki `BUILDER_CODE` ve `APP_ID` (örn. `bc_ikns9i54` / `691a2d6c669aee60603bddd6`) genel ve kamuya açık ID referanslarıdır. Projeyi kendiniz için yapılandıracaksanız `src/lib/erc8021/index.ts` ve `public/.well-known/agent-card.json` içindeki cüzdan adreslerini (`0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`) veya kendi ayarlarınızı kullanarak özelleştirebilirsiniz.
