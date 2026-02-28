export interface SkillModule {
	id: string
	name: string
	link: string
	description?: string
}

export interface Track {
	id: string
	name: string
	emoji: string
	modules: SkillModule[]
}

export const TRACKS: Track[] = [
	{
		id: 'cloud',
		name: 'Cloud & Infrastructure',
		emoji: '☁️',
		modules: [
			{
				id: 'cloud-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
			},
			{
				id: 'cloud-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
			},
			{
				id: 'cloud-3',
				name: 'Build a Virtual Private Cloud',
				link: 'https://learn.nextwork.org/projects/aws-networks-vpc',
			},
			{
				id: 'cloud-4',
				name: 'VPC Traffic Flow and Security',
				link: 'https://learn.nextwork.org/projects/aws-networks-security',
			},
			{
				id: 'cloud-5',
				name: 'Creating a Private Subnet',
				link: 'https://learn.nextwork.org/projects/aws-networks-private',
			},
			{
				id: 'cloud-6',
				name: 'Launching VPC Resources',
				link: 'https://learn.nextwork.org/projects/aws-networks-ec2',
			},
		],
	},
	{
		id: 'cybersec',
		name: 'CyberSecurity',
		emoji: '🔒',
		modules: [
			{
				id: 'cybersec-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
			},
			{
				id: 'cybersec-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
			},
			{
				id: 'cybersec-3',
				name: 'Build a Virtual Private Cloud',
				link: 'https://learn.nextwork.org/projects/aws-networks-vpc',
			},
			{
				id: 'cybersec-4',
				name: 'VPC Traffic Flow and Security',
				link: 'https://learn.nextwork.org/projects/aws-networks-security',
			},
			{
				id: 'cybersec-5',
				name: 'Creating a Private Subnet',
				link: 'https://learn.nextwork.org/projects/aws-networks-private',
			},
			{
				id: 'cybersec-6',
				name: 'Launching VPC Resources',
				link: 'https://learn.nextwork.org/projects/aws-networks-ec2',
			},
		],
	},
	{
		id: 'aiml',
		name: 'AI / ML',
		emoji: '🤖',
		modules: [
			{
				id: 'aiml-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
			},
			{
				id: 'aiml-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
			},
			{
				id: 'aiml-3',
				name: 'AI Prompt Engineering Beginner',
				link: 'https://learn.nextwork.org/projects/ai-promptengineering-beginner',
			},
			{
				id: 'aiml-4',
				name: 'Build Your First AI Workflow',
				link: 'https://learn.nextwork.org/projects/ai-agent-nocode',
			},
			{
				id: 'aiml-5',
				name: 'Set Up a RAG Chatbot in Bedrock',
				link: 'https://learn.nextwork.org/projects/ai-rag-bedrock',
			},
			{
				id: 'aiml-6',
				name: 'AI Coding with Cursor',
				link: 'https://learn.nextwork.org/projects/ai-workspace-cursor',
			},
		],
	},
	{
		id: 'data',
		name: 'Data Science',
		emoji: '📊',
		modules: [
			{
				id: 'data-1',
				name: 'What is Data Engineering?',
				link: 'https://www.ibm.com/think/topics/data-engineering',
			},
			{
				id: 'data-2',
				name: 'How to Become a Data Engineer',
				link: 'https://www.datacamp.com/blog/how-to-become-a-data-engineer',
			},
			{
				id: 'data-3',
				name: 'Data Engineering Explained',
				link: 'https://www.youtube.com/watch?v=qWru-b6m030',
			},
			{
				id: 'data-4',
				name: 'Data Scientist vs Data Engineer',
				link: 'https://www.datacamp.com/blog/data-scientist-vs-data-engineer',
			},
			{
				id: 'data-5',
				name: 'The Concept of Data Generation',
				link: 'https://www.marktechpost.com/2023/02/27/the-concept-of-data-generation/',
			},
			{
				id: 'data-6',
				name: 'Data Storage Concepts',
				link: 'https://www.ibm.com/think/topics/data-storage',
			},
			{
				id: 'data-7',
				name: 'Data Ingestion',
				link: 'https://www.ibm.com/think/topics/data-ingestion',
			},
			{
				id: 'data-8',
				name: 'Data Engineering Lifecycle',
				link: 'https://medium.com/towards-data-engineering/data-engineering-lifecycle-d1e7ee81632e',
			},
			{
				id: 'data-9',
				name: 'SQL SELECT',
				link: 'https://www.w3schools.com/sql/sql_select.asp',
			},
			{
				id: 'data-10',
				name: 'SQL WHERE',
				link: 'https://www.w3schools.com/sql/sql_where.asp',
			},
			{
				id: 'data-11',
				name: 'SQL ORDER BY',
				link: 'https://www.w3schools.com/sql/sql_orderby.asp',
			},
			{
				id: 'data-12',
				name: 'SQL AND',
				link: 'https://www.w3schools.com/sql/sql_and.asp',
			},
			{
				id: 'data-13',
				name: 'SQL OR',
				link: 'https://www.w3schools.com/sql/sql_or.asp',
			},
			{
				id: 'data-14',
				name: 'SQL JOIN',
				link: 'https://www.w3schools.com/sql/sql_join.asp',
			},
			{
				id: 'data-15',
				name: 'SQL INNER JOIN',
				link: 'https://www.w3schools.com/sql/sql_join_inner.asp',
			},
			{
				id: 'data-16',
				name: 'SQL LEFT JOIN',
				link: 'https://www.w3schools.com/sql/sql_join_left.asp',
			},
			{
				id: 'data-17',
				name: 'SQL RIGHT JOIN',
				link: 'https://www.w3schools.com/sql/sql_join_right.asp',
			},
			{
				id: 'data-18',
				name: 'What is a Data Warehouse?',
				link: 'https://www.oracle.com/database/what-is-a-data-warehouse/',
			},
			{
				id: 'data-19',
				name: 'Data Warehouse Tutorial',
				link: 'https://www.youtube.com/watch?v=sigLQluRuzw',
			},
			{
				id: 'data-20',
				name: 'Data Pipeline Tutorial',
				link: 'https://www.youtube.com/watch?v=DlBUuWBfnTs',
			},
			{
				id: 'data-21',
				name: 'Query Data with DynamoDB',
				link: 'https://learn.nextwork.org/projects/aws-databases-query',
			},
			{
				id: 'data-22',
				name: 'Load Data into DynamoDB',
				link: 'https://learn.nextwork.org/projects/aws-databases-dynamodb',
			},
			{
				id: 'data-23',
				name: 'AWS Database Tutorial Playlist',
				link: 'https://www.youtube.com/watch?v=9GVqKuTVANE&list=PLNcg_FV9n7qaUWeyUkPfiVtMbKlrfMqA8',
			},
		],
	},
	{
		id: 'swe',
		name: 'Software Engineering',
		emoji: '💻',
		modules: [
			{
				id: 'swe-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
			},
			{
				id: 'swe-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
			},
			{
				id: 'swe-3',
				name: 'Build a CI/CD Pipeline with AWS',
				link: 'https://learn.nextwork.org/projects/aws-devops-cicd',
			},
			{
				id: 'swe-4',
				name: 'Set Up a Web App in the Cloud',
				link: 'https://learn.nextwork.org/projects/aws-devops-vscode',
			},
			{
				id: 'swe-5',
				name: 'Connect a GitHub Repo with AWS',
				link: 'https://learn.nextwork.org/projects/aws-devops-github',
			},
			{
				id: 'swe-6',
				name: 'Manage Packages with CodeArtifact',
				link: 'https://learn.nextwork.org/projects/aws-devops-codeartifact-updated',
			},
			{
				id: 'swe-7',
				name: 'Build with AWS CodeBuild',
				link: 'https://learn.nextwork.org/projects/aws-devops-codebuild-updated',
			},
			{
				id: 'swe-8',
				name: 'Deploy a Web App with CodeDeploy',
				link: 'https://learn.nextwork.org/projects/aws-devops-codedeploy-updated',
			},
			{
				id: 'swe-9',
				name: 'Infrastructure as Code with CloudFormation',
				link: 'https://learn.nextwork.org/projects/aws-devops-cloudformation-updated',
			},
			{
				id: 'swe-10',
				name: 'Automate with AWS CodePipeline',
				link: 'https://learn.nextwork.org/projects/aws-devops-codepipeline-updated',
			},
		],
	},
	{
		id: 'iot',
		name: 'IoT & Robotics',
		emoji: '🔧',
		modules: [
			{
				id: 'iot-1',
				name: 'IoT & Robotics modules coming soon',
				link: '#',
				description: 'Placeholder — team to fill in real module links',
			},
		],
	},
	{
		id: 'gamedev',
		name: 'Game Development',
		emoji: '🎮',
		modules: [
			{
				id: 'gamedev-1',
				name: 'Unreal Engine 5 Blueprints for Beginners',
				link: 'https://www.skillshare.com/en/classes/unreal-engine-5-blueprints-for-beginners-create-video-games-and-interactive-media/648191339',
			},
			{
				id: 'gamedev-2',
				name: 'Maya and Unity 3D Modeling for Mobile Games',
				link: 'https://www.skillshare.com/en/classes/maya-and-unity-3d-modeling-environment-for-mobile-game/626152152',
			},
			{
				id: 'gamedev-3',
				name: 'Beginner Roblox and Lua: Making Games',
				link: 'https://www.skillshare.com/en/classes/beginner-roblox-and-lua-start-making-games-with-roblox-studio/1724954249/projects',
			},
		],
	},
	{
		id: 'uiux',
		name: 'UI/UX',
		emoji: '🎨',
		modules: [
			{
				id: 'uiux-1',
				name: 'Figma UI/UX Design Essentials',
				link: 'https://www.skillshare.com/en/classes/figma-ui-ux-design-essentials/1088693386',
			},
		],
	},
]
