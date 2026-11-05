export type PushEnvironment = {
	secure: boolean;
	apisAvailable: boolean;
	ios: boolean;
	installed: boolean;
	permission: NotificationPermission;
};
export type PushBlock = {
	kind: "https" | "install" | "unsupported" | "denied";
	label: string;
	message: string;
};
export function pushBlock(environment: PushEnvironment): PushBlock | null {
	if (!environment.secure)
		return {
			kind: "https",
			label: "Conexão HTTPS necessária",
			message:
				"Este endereço usa HTTP. O celular só permite notificações em um endereço HTTPS confiável. Os pedidos continuam disponíveis no painel, mas instalar este endereço HTTP não ativa os avisos.",
		};
	if (environment.ios && !environment.installed)
		return {
			kind: "install",
			label: "Adicione à Tela de Início",
			message:
				"No iPhone/iPad, abra no Safari, toque em Compartilhar e em Adicionar à Tela de Início. Abra o ícone instalado, entre novamente e ative as notificações. É necessário iOS/iPadOS 16.4 ou mais recente.",
		};
	if (!environment.apisAvailable)
		return {
			kind: "unsupported",
			label: "Navegador sem suporte",
			message:
				"Este navegador não oferece as APIs de notificação necessárias. Use um navegador compatível atualizado, como Safari no iPhone ou Chrome no Android.",
		};
	if (environment.permission === "denied")
		return {
			kind: "denied",
			label: "Permissão bloqueada",
			message:
				"As notificações foram bloqueadas neste navegador. Permita os avisos nas configurações do site e volte a este painel.",
		};
	return null;
}
