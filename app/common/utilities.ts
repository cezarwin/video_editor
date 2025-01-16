import CryptoJS from 'crypto-js';
import builder from 'xmlbuilder';
import fileDownload from 'js-file-download';
import { SECRET } from '../../config.mjs';
import { DEMO } from './staticData';

interface Tag {
    video_url: string;
    player_fname?: string;
    player_lname?: string;
    jersey?: string;
    start_time: string;
    end_time: string;
    action_name: string;
    action_id?: number;
    action_type_id?: number;
    action_result_id?: number;
    action_result_name?: string;
    action_type_name?: string;
    player_id?: number;
}

export const createCommand = async (tagList: Tag[], name: string): Promise<void> => {
    const rawVideoList = [...new Set(tagList.map((tag) => tag.video_url))];
    const videoList = await Promise.all(
        rawVideoList.map(async (url) => {
            if (url?.includes('youtube.com') || url?.includes('youtu.be')) {
                return url;
            }
            return url;
        })
    );

    const videos = videoList.map((tag) => ({
        url: tag,
        SecondBoxText: tagList[0]?.player_fname
            ? `#${tagList[0]?.jersey} ${tagList[0]?.player_fname} ${tagList[0]?.player_lname}`
            : name
    }));

    const clips = tagList.map((tag) => ({
        Video: rawVideoList.indexOf(tag.video_url) + 1,
        Trim: `${toSecond(tag.start_time)}:${toSecond(tag.end_time)}`,
        FirstBoxText: `${tag.action_name ?? 'Team Actions'}`
    }));

    const obj = {
        Render: {
            FileData: {
                Name: name,
                Format: 'mp4',
                Resolution: '1280x720',
                FPS: '60',
                Preset: 'ultrafast',
                FontFile: 'ArialBold.ttf',
                FontColor: '#ffffff',
                FontSize: '35',
                FirstBoxSize: '300x60',
                FirstBoxColor: '#808080@0.7',
                FirstBoxFormat: 'rgba',
                SeconBoxSize: '500x60',
                SecondBoxColor: '#FFA500@0.7',
                SecondBoxFormat: 'rgba',
                LogoURL: 'https://s4usitesimages.s3.amazonaws.com/images/JustSmallLogo.png'
            },
            Videos: { Video: videos },
            Clips: { Clip: clips }
        }
    };

    const command = builder.create(obj).end({ pretty: true });
    fileDownload(command, `${name}.xml`);
};

export function toHHMMSS(data: number | string): string {
    if (!data || data === '') return '00:00:00';
    let sec_num = parseInt(String(data), 10);
    if (sec_num < 0) sec_num = 0;
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - hours * 3600) / 60);
    let seconds = sec_num - hours * 3600 - minutes * 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function addSecToHHMMSS(str: string, sec: number): string {
    return toHHMMSS(toSecond(str) + sec);
}

export function subSecToHHMMSS(str: string, sec: number): string {
    return toHHMMSS(toSecond(str) - sec);
}

export function toSecond(data: string): number {
    if (!data || data === '') return 0;
    const a = data.split(':');
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
}

export function getUser() {
    try {
        const encrypted = localStorage.getItem('user')
        if (encrypted) {
            const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET).toString(CryptoJS.enc.Utf8)
            return JSON.parse(decrypted)
        }
    } catch (e) {
        console.error('getting user error')
    }
    return null
}

export function setUser(user: any): void {
    try {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), SECRET).toString();
        // Set in localStorage
        localStorage.setItem('user', encrypted);
        // Set in cookie with proper attributes
        document.cookie = `user=${encrypted}; path=/; max-age=86400; samesite=lax`; // 24 hours expiry
    } catch (e) {
        console.error('saving user error');
    }
}

export function clearUser(): void {
    try {
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {
        console.error('clearing user error');
    }
}

export function parseJwt(token: string): any {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

interface ActionData {
    [key: string]: {
        [key: string]: {
            success: Tag[];
            unsuccess: Tag[];
        };
    };
}

export function divideTags(tagList: Tag[]): ActionData {
    const actions: ActionData = {};

    tagList.forEach((tag) => {
        const actionKey = tag.action_name;
        const typeKey = tag.action_type_name || '';

        if (!actions[actionKey]) {
            actions[actionKey] = {};
        }
        if (!actions[actionKey][typeKey]) {
            actions[actionKey][typeKey] = { success: [], unsuccess: [] };
        }

        if (DEMO[actionKey]?.success.includes(tag.action_result_name)) {
            actions[actionKey][typeKey].success.push(tag);
        } else {
            actions[actionKey][typeKey].unsuccess.push(tag);
        }
    });

    return actions;
}

export function filterSuccessTags(tagList: Tag[]): { [key: string]: Tag[][] } {
    const actions: { [key: string]: Tag[][] } = {};

    tagList.forEach((tag) => {
        const actionKey = tag.action_name;
        if (DEMO[actionKey]?.success.includes(tag.action_result_name)) {
            if (!actions[actionKey]) {
                actions[actionKey] = [[]];
            }
            actions[actionKey][0].push(tag);
        }
    });

    return actions;
}

export function getPercent(value: number, max: number): number {
    return (value * 100) / max;
}
