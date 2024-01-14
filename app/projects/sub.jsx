"use client";
import { Card } from "../components/card";
import { Article } from "./article";
import { useSearchParams } from 'next/navigation';

export const Sub = ({ repositories }) => {
    const searchParams = useSearchParams();
    const area = searchParams.get('area');

    const ml = ["is_it_food", "Kaggle-Titanic", "pytorch_custom_data", "computer_vision_MNIST"]
    // add gnn project
    const custom_APIs = ["Custom_Auth_API", "e-commerce-api", ]
    const data_structures = []
    // add 474 as Reinforcement learning
    const games = []
    const full_stack_apps = ["imYale"]
    // add yale streamlit, 

    let correct;
    if (area == "Machine Learning") {
        correct = ml
    } else if (area == "Full Stack Applications") {
        correct = full_stack_apps
    } else if (area == "Custom Backend APIs") {
        correct = custom_APIs
    } else if (area == "Data Structures") {
        correct = data_structures
    } else {
        correct = games
    }
            
    const display_repos = repositories.filter((p) => correct.includes(p.name))

	return (
        <div className="grid grid-cols-2 gap-4 mx-auto lg:mx-0">
                            {display_repos.map((project) => (
                                    <Card key={project.name}>
                                        <Article project={project} />
                                    </Card>
                                ))}
                    </div>
	);
};
