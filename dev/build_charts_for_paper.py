import matplotlib.pyplot as plt
import numpy as np

category_names = ['Disagree',
'Agree',
'Strongly Agree',
'Don\'t know / unsure',
]



results = {
    'The game was easy to play': [1,6,5,0],
    'I have gained additional knowledge around climate resilience and interventions': [0,10,2,0],
    'I have greater awareness that climate related issues can be viewed from different perspectives': [0,8,4,0],
    'I am more aware that climate interventions may be impacted, or cause impacts beyond their intended scope': [0,8,4,0],
    'The game sparked discussion about climate resilience': [1,5,6,0],
    'There was too much information on the cards': [8,2,1,1],
    'The card design was clear': [0,9,2,1]
}


def survey(results, category_names):
    """
    Parameters
    ----------
    results : dict
        A mapping from question labels to a list of answers per category.
        It is assumed all lists contain the same number of entries and that
        it matches the length of *category_names*.
    category_names : list of str
        The category labels.
    """
    labels = list(results.keys())
    data = np.array(list(results.values()))
    data_cum = data.cumsum(axis=1)
    category_colors = plt.colormaps['RdYlGn'](
        np.linspace(0.15, 0.85, data.shape[1]))

    fig, ax = plt.subplots(figsize=(9.2, 5))
    ax.invert_yaxis()
    ax.xaxis.set_visible(False)
    ax.set_xlim(0, np.sum(data, axis=1).max())

    for i, (colname, color) in enumerate(zip(category_names, category_colors)):
        widths = data[:, i]
        starts = data_cum[:, i] - widths
        rects = ax.barh(labels, widths, left=starts, height=0.5,
                        label=colname, color=color)

        r, g, b, _ = color
        text_color = 'white' if r * g * b < 0.5 else 'darkgrey'
        ax.bar_label(rects, label_type='center', color=text_color)
    ax.legend(ncols=len(category_names), bbox_to_anchor=(0, 1),
              loc='lower left', fontsize='small')

    return fig, ax


survey(results, category_names)
plt.show()