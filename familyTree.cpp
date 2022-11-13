#include <bits/stdc++.h>
using namespace std;

class Node
{
public:
    string name;
    Node *spouse;
    vector<Node *> parents;
    vector<Node *> siblings;
    vector<Node *> children;
    vector<Node *> grandparents;
    vector<Node *> grandchildren;
    Node(string name)
    {
        this->name = name;
        this->spouse = NULL;
    }
};
unordered_map<string, Node *> existMap;

void buildNodes(vector<vector<string>> data)
{
    // Building nodes for all people in our graph
    for (auto itr : data)
    {
        if (existMap.find(itr[0]) == existMap.end())
        {
            Node *newNode = new Node(itr[0]);
            existMap.insert({itr[0], newNode});
        }
        if (itr[1] != "NULL" && existMap.find(itr[1]) == existMap.end())
        {
            Node *newNode = new Node(itr[1]);
            existMap.insert({itr[1], newNode});
        }
        if (itr[2] != "NULL" && existMap.find(itr[2]) == existMap.end())
        {
            Node *newNode = new Node(itr[2]);
            existMap.insert({itr[2], newNode});
        }
        if (itr[3] != "NULL" && existMap.find(itr[3]) == existMap.end())
        {
            Node *newNode = new Node(itr[3]);
            existMap.insert({itr[3], newNode});
        }
    }
}

void buildGraph(vector<vector<string>> data)
{
    // Building a graph with relations
    for (auto itr : data)
    {
        Node *selfNode = existMap[itr[0]];

        if (itr[1] != "NULL")
        {
            // father-child
            Node *relationNode = existMap[itr[1]];      // father
            selfNode->parents.push_back(relationNode);  // child
            relationNode->children.push_back(selfNode); // father ke child me self

            // current child is new, it has to be connected to all prev children
            for (auto itr : relationNode->children)
            {
                if(itr!=selfNode){
                    itr->siblings.push_back(selfNode);
                    selfNode->siblings.push_back(itr);
                }
            }

            // adding children to spouse
            if (relationNode->spouse != NULL)
            {
                // mummy me selfnode copy
                relationNode->spouse->children.push_back(selfNode);
                selfNode->parents.push_back(relationNode->spouse);
            }

            if (relationNode->parents.size() != 0)
            {
                //adding grandparents to self
                copy(relationNode->parents.begin(), relationNode->parents.end(), back_inserter(selfNode->grandparents));
                for (auto itr : relationNode->parents)
                {
                    //adding children to grandparent
                    itr->grandchildren.push_back(selfNode);
                }
            }
        }
        else if (itr[2] != "NULL")
        {
            // mother-child
            Node *relationNode = existMap[itr[2]];
            selfNode->parents.push_back(relationNode);
            relationNode->children.push_back(selfNode);

            for (auto itr : relationNode->children)
            {
                itr->siblings.push_back(selfNode);
                selfNode->siblings.push_back(itr);
            }

            // adding children to spouse
            if (relationNode->spouse != NULL)
            {
                // papa me selfnode copy
                relationNode->spouse->children.push_back(selfNode);
                selfNode->parents.push_back(relationNode->spouse);
            }
        }
        else if (itr[3] != "NULL")
        {
            // spouse
            Node *relationNode = existMap[itr[3]];
            selfNode->spouse = relationNode;
            relationNode->spouse = selfNode;
            if (relationNode->children.size() != 0)
            {
                copy(relationNode->children.begin(), relationNode->children.end(), back_inserter(selfNode->children));
            }
            else if (selfNode->children.size() != 0)
            {
                copy(selfNode->children.begin(), selfNode->children.end(), back_inserter(relationNode->children));
            }

            if (relationNode->grandchildren.size() != 0)
            {
                copy(relationNode->grandchildren.begin(), relationNode->grandchildren.end(), back_inserter(selfNode->grandchildren));
            }
            else if (selfNode->grandchildren.size() != 0)
            {
                copy(selfNode->grandchildren.begin(), selfNode->grandchildren.end(), back_inserter(relationNode->grandchildren));
            }
        }
    }
}

void displayTree(string name)
{
    Node *addressNode = existMap[name];

    // printing spouse
    if (addressNode->spouse != NULL)
    {
        cout << "Spouse: " << addressNode->spouse->name << "\n";
    }

    // printing parent
    if (addressNode->parents.size() != 0)
    {
        cout << "Parents: ";
        for (auto itr : addressNode->parents)
        {
            cout << itr->name << " ";
        }
        cout << "\n";
    }

    // printing children
    if (addressNode->children.size() != 0)
    {
        cout << "Children: ";
        for (auto itr : addressNode->children)
        {
            cout << itr->name << " ";
        }
        cout << "\n";
    }

    // printing sibling
    if (addressNode->siblings.size() != 0)
    {
        cout << "Siblings: ";
        for (auto itr : addressNode->siblings)
        {
            if (addressNode->name != itr->name)
                cout << itr->name << " ";
        }
        cout << "\n";
    }

    // printing grandparent
    if (addressNode->grandparents.size() != 0)
    {
        cout << "Grandparents: ";
        for (auto itr : addressNode->grandparents)
        {
            cout << itr->name << " ";
        }
        cout << "\n";
    }

    if (addressNode->grandchildren.size() != 0)
    {
        cout << "GrandChildren: ";
        for (auto itr : addressNode->grandchildren)
        {
            cout << itr->name << " ";
        }
        cout << "\n";
    }
}

int main()
{

    vector<vector<string>> data = {{"AshokKumar", "SukhaRam", "NULL", "NULL"}, {"Urmila", "NULL", "NULL", "AshokKumar"}, {"Zeevash", "AshokKumar", "NULL", "NULL"}, {"Meenakshi", "AshokKumar", "NULL", "NULL"}};

    buildNodes(data);
    buildGraph(data);

    displayTree("AshokKumar");
    cout<<"\n";
    displayTree("SukhaRam");
    cout<<"\n";
    displayTree("Urmila");
    cout<<"\n";
    displayTree("Zeevash");
    cout<<"\n";
    displayTree("Meenakshi");

    return 0;
}